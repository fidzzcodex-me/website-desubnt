function reportToMarkdown(report) {
  if (!report) return ''
  const lines = []
  lines.push(`# Laporan Desain — ${report.finalUrl}`)
  lines.push('')
  lines.push(`Dianalisis: ${report.analyzedAt}`)
  lines.push(`Status HTTP: ${report.status}`)
  lines.push('')

  lines.push('## Overview')
  lines.push(`- Judul: ${report.overview.title || '-'}`)
  lines.push(`- Deskripsi: ${report.overview.description || '-'}`)
  lines.push(`- Theme color: ${report.overview.themeColor || '-'}`)
  lines.push(`- Bahasa: ${report.overview.lang || '-'}`)
  lines.push('')

  lines.push('## Warna')
  if (report.colors.palette.length === 0) {
    lines.push('- Tidak ada warna dominan terdeteksi')
  } else {
    for (const color of report.colors.palette) {
      lines.push(`- ${color.value} (muncul ${color.count}x)`)
    }
  }
  lines.push(`- Mode: ${report.colors.modeGuess}`)
  lines.push('')

  lines.push('## Font')
  if (report.fonts.length === 0) {
    lines.push('- Tidak ada font kustom terdeteksi')
  } else {
    for (const font of report.fonts) {
      lines.push(`- ${font.name} (${font.source})`)
    }
  }
  lines.push('')

  lines.push('## Motion')
  if (report.motion.libraries.length === 0) {
    lines.push('- Tidak ada library motion yang dikenali')
  } else {
    for (const lib of report.motion.libraries) {
      lines.push(`- ${lib.name} (confidence: ${lib.confidence})`)
    }
  }
  if (report.motion.cssSignals.length > 0) {
    lines.push(`- Sinyal CSS: ${report.motion.cssSignals.join(', ')}`)
  }
  lines.push('')

  lines.push('## Stack')
  if (report.stack.length === 0) {
    lines.push('- Tidak ada stack yang teridentifikasi jelas')
  } else {
    for (const item of report.stack) {
      lines.push(`- ${item.name} (confidence: ${item.confidence})`)
    }
  }
  lines.push('')

  lines.push('## Layout')
  for (const signal of report.layout.signals) {
    lines.push(`- ${signal}`)
  }
  lines.push('')

  lines.push('## Assets')
  lines.push(`- Script: ${report.assets.scripts}`)
  lines.push(`- Stylesheet: ${report.assets.stylesheets}`)
  lines.push(`- Favicon: ${report.assets.favicon}`)
  if (report.assets.externalDomains.length > 0) {
    lines.push(`- Domain eksternal: ${report.assets.externalDomains.join(', ')}`)
  }
  lines.push('')

  if (report.notes.length > 0) {
    lines.push('## Catatan')
    for (const note of report.notes) {
      lines.push(`- ${note}`)
    }
  }

  return lines.join('\n')
}

function reportToJson(report) {
  return JSON.stringify(report, null, 2)
}

function downloadTextFile(filename, content, mimeType) {
  const blob = new Blob([content], { type: mimeType })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(link.href)
}

module.exports = { reportToMarkdown, reportToJson, downloadTextFile }
