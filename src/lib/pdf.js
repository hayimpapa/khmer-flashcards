import { jsPDF } from 'jspdf'

// jsPDF's built-in fonts cover Latin only. Khmer Unicode is rendered to an
// offscreen <canvas> (which can use any web font loaded by the page) and
// embedded as a PNG. That keeps the bundle small while still producing
// real, printable Khmer glyphs.

function renderTextToCanvasPng(text, { fontShorthand, color = '#7c4510', maxWidthPx, heightPx }) {
  const scale = 3 // crisp for print
  const measureCanvas = document.createElement('canvas')
  const mctx = measureCanvas.getContext('2d')
  mctx.font = fontShorthand
  const metrics = mctx.measureText(text)
  const wPx = Math.ceil(Math.min(metrics.width, maxWidthPx ?? 4000)) + 8
  const hPx = heightPx

  const c = document.createElement('canvas')
  c.width = Math.max(1, wPx * scale)
  c.height = Math.max(1, hPx * scale)
  const ctx = c.getContext('2d')
  ctx.scale(scale, scale)
  ctx.font = fontShorthand
  ctx.fillStyle = color
  ctx.textBaseline = 'middle'
  ctx.textAlign = 'center'
  ctx.fillText(text, wPx / 2, hPx / 2, maxWidthPx)

  return { dataUrl: c.toDataURL('image/png'), widthPx: wPx, heightPx: hPx }
}

function placeKhmerImage(doc, text, opts) {
  // Place a Khmer-rendered PNG into the PDF, scaled to fit within the
  // available width/height (in PDF points).
  const { x, y, maxWidth, maxHeight, fontPx = 80, weight = 700, color } = opts
  const png = renderTextToCanvasPng(text, {
    fontShorthand: `${weight} ${fontPx}px "Noto Sans Khmer", "Noto Serif Khmer", sans-serif`,
    color,
    maxWidthPx: 2000,
    heightPx: Math.ceil(fontPx * 1.4) + 8,
  })
  // 1 px ≈ 0.75 pt (at 96 dpi). Convert and then scale to fit.
  const wPt = png.widthPx * 0.75
  const hPt = png.heightPx * 0.75
  const scale = Math.min(maxWidth / wPt, maxHeight / hPt, 1)
  const w = wPt * scale
  const h = hPt * scale
  doc.addImage(png.dataUrl, 'PNG', x + (maxWidth - w) / 2, y + (maxHeight - h) / 2, w, h)
}

// Inches → points
const IN = 72

export async function generateFlashcardsPdf({
  deckName,
  cards,
  includePractice,
  includeImagePlaceholder,
  layout,
  direction = 'khmer-first',
}) {
  if (!cards || cards.length === 0) throw new Error('No cards selected.')

  const doc = new jsPDF({ unit: 'pt', format: 'letter', orientation: 'portrait' })
  const pageW = doc.internal.pageSize.getWidth() // 612pt
  const pageH = doc.internal.pageSize.getHeight() // 792pt

  // ── layout geometry ──────────────────────────────────────────────────────
  // 2 per page: 8.5 × 5.5 cards stacked, 0.5in top margin, 0.5in between/below
  // 4 per page: 4.25 × 5.5 cards, 2×2 grid
  const slots = []
  if (layout === '2-per-page') {
    const cardW = 8.5 * IN - 0.5 * IN * 2 // 7.5in wide centered
    const cardH = 4.5 * IN
    const left = (pageW - cardW) / 2
    const topMargin = 0.5 * IN
    const gap = 0.25 * IN
    slots.push({ x: left, y: topMargin, w: cardW, h: cardH })
    slots.push({ x: left, y: topMargin + cardH + gap, w: cardW, h: cardH })
  } else {
    const cardW = 3.75 * IN
    const cardH = 4.5 * IN
    const leftMargin = (pageW - cardW * 2 - 0.25 * IN) / 2
    const topMargin = 0.4 * IN
    const gapX = 0.25 * IN
    const gapY = 0.2 * IN
    for (let r = 0; r < 2; r++) {
      for (let c = 0; c < 2; c++) {
        slots.push({
          x: leftMargin + c * (cardW + gapX),
          y: topMargin + r * (cardH + gapY),
          w: cardW,
          h: cardH,
        })
      }
    }
  }
  const perPage = slots.length

  // Two-sided print: emit a "fronts" page, then a "backs" page mirrored so
  // when duplex-printed the backs line up. We mirror horizontally for both
  // layouts: card on the left of the front becomes card on the right of
  // the back.
  const totalPages = Math.ceil(cards.length / perPage)

  const khmerFirst = direction === 'khmer-first'
  const frontLabel = khmerFirst ? 'Khmer' : 'English'
  const backLabel = khmerFirst ? 'English' : 'Khmer'

  for (let p = 0; p < totalPages; p++) {
    const batch = cards.slice(p * perPage, p * perPage + perPage)

    // FRONT side
    if (p > 0) doc.addPage()
    drawPageHeader(
      doc,
      `${deckName} — ${frontLabel} (page ${p + 1}/${totalPages})`,
      pageW,
      pageH,
    )
    batch.forEach((card, i) =>
      khmerFirst
        ? drawKhmerSide(doc, slots[i], card, {
            includePractice,
            includeImagePlaceholder,
            isFront: true,
          })
        : drawEnglishSide(doc, slots[i], card, {
            includeImagePlaceholder,
            isFront: true,
          }),
    )

    // BACK side
    doc.addPage()
    drawPageHeader(
      doc,
      `${deckName} — ${backLabel} (page ${p + 1}/${totalPages})`,
      pageW,
      pageH,
    )
    const mirrored = mirrorSlots(slots, layout, pageW)
    batch.forEach((card, i) =>
      khmerFirst
        ? drawEnglishSide(doc, mirrored[i], card, {
            includeImagePlaceholder,
            isFront: false,
          })
        : drawKhmerSide(doc, mirrored[i], card, {
            includePractice,
            includeImagePlaceholder,
            isFront: false,
          }),
    )
  }

  const safeName = deckName.replace(/[^a-z0-9\-_]+/gi, '-').toLowerCase() || 'deck'
  doc.save(`${safeName}-flashcards.pdf`)
}

function mirrorSlots(slots, layout, pageW) {
  if (layout === '2-per-page') {
    // Stacked vertically — vertical order already matches; mirror is identity.
    return slots
  }
  // 4-per-page: swap left/right columns within each row so duplex aligns.
  // slots are [r0c0, r0c1, r1c0, r1c1]; swap pairs.
  return [slots[1], slots[0], slots[3], slots[2]].map((s, i) => ({ ...s }))
}

function drawPageHeader(doc, title, pageW, pageH) {
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(120)
  doc.text(title, pageW / 2, 24, { align: 'center' })
  doc.setTextColor(0)
}

function drawCardOutline(doc, slot) {
  doc.setDrawColor(180)
  doc.setLineDashPattern([3, 3], 0)
  doc.setLineWidth(0.5)
  doc.roundedRect(slot.x, slot.y, slot.w, slot.h, 8, 8, 'S')
  doc.setLineDashPattern([], 0)
}

function drawSideLabel(doc, slot, text, rgb) {
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.setTextColor(...rgb)
  doc.text(text, slot.x + 14, slot.y + 18)
  doc.setTextColor(0)
}

function drawCardImage(doc, slot, card, { includePlaceholder, tone }) {
  // Returns the y-coordinate of the bottom of the image area (or null
  // if no image area was drawn).
  if (!includePlaceholder && !card.image_url) return null
  const boxW = slot.w * 0.45
  const boxH = slot.h * 0.34
  const boxX = slot.x + (slot.w - boxW) / 2
  const boxY = slot.y + 28
  const hasImage = card.image_url && card.image_url.startsWith('data:image')
  if (hasImage) {
    try {
      const fmt = /^data:image\/(jpe?g)/i.test(card.image_url) ? 'JPEG' : 'PNG'
      doc.addImage(card.image_url, fmt, boxX, boxY, boxW, boxH, undefined, 'FAST')
    } catch {
      drawImageBox(doc, boxX, boxY, boxW, boxH, tone)
    }
  } else {
    drawImageBox(doc, boxX, boxY, boxW, boxH, tone)
  }
  return boxY + boxH
}

function drawKhmerSide(doc, slot, card, { includePractice, includeImagePlaceholder }) {
  drawCardOutline(doc, slot)
  drawSideLabel(doc, slot, 'KHMER · ខ្មែរ', [168, 95, 23])

  const imageBottom = drawCardImage(doc, slot, card, {
    includePlaceholder: includeImagePlaceholder,
    tone: 'khmer',
  })

  const khmerTop = (imageBottom ?? slot.y + 24) + 10
  const khmerHeight = slot.h * 0.28
  placeKhmerImage(doc, card.khmer_text, {
    x: slot.x + 16,
    y: khmerTop,
    maxWidth: slot.w - 32,
    maxHeight: khmerHeight,
    fontPx: 88,
    weight: 700,
    color: '#7c4510',
  })

  let cursorY = khmerTop + khmerHeight + 6
  if (includePractice) {
    const linesY = cursorY
    const lineLeft = slot.x + 28
    const lineRight = slot.x + slot.w - 28
    const baseline = linesY + 24
    doc.setDrawColor(210)
    doc.setLineWidth(0.4)
    doc.setLineDashPattern([2, 3], 0)
    doc.line(lineLeft, linesY, lineRight, linesY)
    doc.line(lineLeft, linesY + 12, lineRight, linesY + 12)
    doc.setLineDashPattern([], 0)
    doc.setDrawColor(150)
    doc.line(lineLeft, baseline, lineRight, baseline)
    cursorY = baseline + 6
  }

  doc.setFont('helvetica', 'italic')
  doc.setFontSize(13)
  doc.setTextColor(35, 109, 134)
  doc.text(card.khmer_transliteration || '', slot.x + slot.w / 2, cursorY + 10, {
    align: 'center',
    maxWidth: slot.w - 40,
  })

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(58, 139, 166)
  doc.text(`“${card.english_phonetic || ''}”`, slot.x + slot.w / 2, cursorY + 26, {
    align: 'center',
    maxWidth: slot.w - 40,
  })
  doc.setTextColor(0)
}

function drawEnglishSide(doc, slot, card, { includeImagePlaceholder }) {
  drawCardOutline(doc, slot)
  drawSideLabel(doc, slot, 'ENGLISH', [53, 109, 60])

  const imageBottom = drawCardImage(doc, slot, card, {
    includePlaceholder: includeImagePlaceholder,
    tone: 'english',
  })

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(30)
  doc.setTextColor(35, 77, 40)
  doc.text(
    card.english_translation || '',
    slot.x + slot.w / 2,
    (imageBottom ?? slot.y + slot.h / 2) + 38,
    { align: 'center', maxWidth: slot.w - 40 },
  )

  // Pronunciation reminder at the bottom (helps Khmer-speaking learners).
  doc.setFont('helvetica', 'italic')
  doc.setFontSize(9)
  doc.setTextColor(120)
  doc.text(
    `${card.khmer_transliteration || ''} · “${card.english_phonetic || ''}”`,
    slot.x + slot.w / 2,
    slot.y + slot.h - 14,
    { align: 'center', maxWidth: slot.w - 40 },
  )
  doc.setTextColor(0)
}

function drawImageBox(doc, x, y, w, h, tone) {
  const stroke = tone === 'khmer' ? [212, 180, 140] : [180, 200, 184]
  doc.setDrawColor(...stroke)
  doc.setLineWidth(0.8)
  doc.setLineDashPattern([4, 3], 0)
  doc.roundedRect(x, y, w, h, 6, 6, 'S')
  doc.setLineDashPattern([], 0)
  doc.setFont('helvetica', 'italic')
  doc.setFontSize(9)
  doc.setTextColor(150)
  doc.text('draw or paste a picture here', x + w / 2, y + h / 2 + 3, { align: 'center' })
  doc.setTextColor(0)
}
