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

  for (let p = 0; p < totalPages; p++) {
    const batch = cards.slice(p * perPage, p * perPage + perPage)

    // FRONT side
    if (p > 0) doc.addPage()
    drawPageHeader(doc, `${deckName} — Front (page ${p + 1}/${totalPages})`, pageW, pageH)
    batch.forEach((card, i) => drawFront(doc, slots[i], card, { includePractice }))

    // BACK side
    doc.addPage()
    drawPageHeader(doc, `${deckName} — Back (page ${p + 1}/${totalPages})`, pageW, pageH)
    // Mirror slot order so duplex backs line up with their fronts.
    const mirrored = mirrorSlots(slots, layout, pageW)
    batch.forEach((card, i) =>
      drawBack(doc, mirrored[i], card, { includeImagePlaceholder }),
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

function drawFront(doc, slot, card, { includePractice }) {
  drawCardOutline(doc, slot)

  // Label
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.setTextColor(168, 95, 23) // khmer-600
  doc.text('KHMER', slot.x + 14, slot.y + 18)

  // Khmer Unicode (rendered to canvas → PNG)
  const khmerHeight = slot.h * 0.36
  placeKhmerImage(doc, card.khmer_text, {
    x: slot.x + 16,
    y: slot.y + 24,
    maxWidth: slot.w - 32,
    maxHeight: khmerHeight,
    fontPx: 96,
    weight: 700,
    color: '#7c4510',
  })

  // Ruled handwriting lines (under the Khmer block)
  let cursorY = slot.y + 24 + khmerHeight + 6
  if (includePractice) {
    const linesY = cursorY
    const lineLeft = slot.x + 24
    const lineRight = slot.x + slot.w - 24
    const baseline = linesY + 28
    doc.setDrawColor(210)
    doc.setLineWidth(0.4)
    // top guide
    doc.setLineDashPattern([2, 3], 0)
    doc.line(lineLeft, linesY, lineRight, linesY)
    // mid (dotted)
    doc.line(lineLeft, linesY + 14, lineRight, linesY + 14)
    doc.setLineDashPattern([], 0)
    // baseline (solid)
    doc.setDrawColor(150)
    doc.line(lineLeft, baseline, lineRight, baseline)
    cursorY = baseline + 8
  }

  // Transliteration + phonetic guide
  doc.setFont('helvetica', 'italic')
  doc.setFontSize(14)
  doc.setTextColor(35, 109, 134) // phonetic-600
  doc.text(card.khmer_transliteration || '', slot.x + slot.w / 2, cursorY + 12, {
    align: 'center',
    maxWidth: slot.w - 40,
  })

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(11)
  doc.setTextColor(58, 139, 166) // phonetic-500
  doc.text(`pronounced “${card.english_phonetic || ''}”`, slot.x + slot.w / 2, cursorY + 30, {
    align: 'center',
    maxWidth: slot.w - 40,
  })

  // Footer hint
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7)
  doc.setTextColor(170)
  doc.text('What does this mean?', slot.x + slot.w / 2, slot.y + slot.h - 10, {
    align: 'center',
  })
  doc.setTextColor(0)
}

function drawBack(doc, slot, card, { includeImagePlaceholder }) {
  drawCardOutline(doc, slot)

  // Label
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.setTextColor(53, 109, 60) // english-600
  doc.text('ENGLISH', slot.x + 14, slot.y + 18)

  // Image placeholder
  let imageBottom = slot.y + 24
  if (includeImagePlaceholder) {
    const boxW = slot.w * 0.55
    const boxH = slot.h * 0.42
    const boxX = slot.x + (slot.w - boxW) / 2
    const boxY = slot.y + 30

    if (card.image_url && card.image_url.startsWith('data:image')) {
      try {
        const fmt = /^data:image\/(jpe?g)/i.test(card.image_url) ? 'JPEG' : 'PNG'
        doc.addImage(card.image_url, fmt, boxX, boxY, boxW, boxH, undefined, 'FAST')
      } catch {
        drawImageBox(doc, boxX, boxY, boxW, boxH)
      }
    } else {
      drawImageBox(doc, boxX, boxY, boxW, boxH)
    }
    imageBottom = boxY + boxH
  }

  // English translation
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(28)
  doc.setTextColor(35, 77, 40) // english-700
  doc.text(card.english_translation || '', slot.x + slot.w / 2, imageBottom + 40, {
    align: 'center',
    maxWidth: slot.w - 40,
  })

  // Subtle reminder of the front side
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

function drawImageBox(doc, x, y, w, h) {
  doc.setDrawColor(180, 200, 184) // english-100ish
  doc.setLineWidth(0.8)
  doc.setLineDashPattern([4, 3], 0)
  doc.roundedRect(x, y, w, h, 6, 6, 'S')
  doc.setLineDashPattern([], 0)
  doc.setFont('helvetica', 'italic')
  doc.setFontSize(9)
  doc.setTextColor(140, 160, 145)
  doc.text('draw or paste a picture here', x + w / 2, y + h / 2 + 3, { align: 'center' })
  doc.setTextColor(0)
}
