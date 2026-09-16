function SectionHeading({ children }) {
  return <h3 className="mb-4 text-sm font-semibold text-ink-900">{children}</h3>
}

function ConfidenceTag({ level }) {
  const styles = {
    high: 'bg-brand-50 text-brand-700',
    medium: 'bg-ink-100 text-ink-700',
    low: 'bg-ink-100 text-ink-500'
  }
  return (
    <span className={`data-label rounded-md px-2 py-0.5 text-[11px] ${styles[level] || styles.medium}`}>
      {level}
    </span>
  )
}

export default function ReportView({ report }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-100 bg-brand-50/50 px-6 py-4">
        <div>
          <p className="data-label text-xs text-brand-700">{report.finalUrl}</p>
          <p className="text-xs text-ink-500">
            Dianalisis {new Date(report.analyzedAt).toLocaleString('id-ID')} · Status {report.status}
          </p>
        </div>
      </div>

      <div className="divide-y divide-ink-100">
        <div className="px-6 py-6">
          <SectionHeading>Overview</SectionHeading>
          <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-ink-500">Judul</dt>
              <dd className="text-ink-900">{report.overview.title || '-'}</dd>
            </div>
            <div>
              <dt className="text-ink-500">Theme color</dt>
              <dd className="data-label text-ink-900">{report.overview.themeColor || '-'}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-ink-500">Deskripsi</dt>
              <dd className="text-ink-900">{report.overview.description || '-'}</dd>
            </div>
            <div>
              <dt className="text-ink-500">Bahasa</dt>
              <dd className="text-ink-900">{report.overview.lang || '-'}</dd>
            </div>
          </dl>
        </div>

        <div className="px-6 py-6">
          <SectionHeading>Warna</SectionHeading>
          {report.colors.palette.length === 0 ? (
            <p className="text-sm text-ink-500">Tidak ada warna dominan yang terdeteksi.</p>
          ) : (
            <div className="flex flex-wrap gap-4">
              {report.colors.palette.map((color) => (
                <div key={color.value} className="flex flex-col items-center gap-2">
                  <span
                    className="h-12 w-12 rounded-lg border border-ink-100"
                    style={{ backgroundColor: color.value }}
                  />
                  <span className="data-label text-xs text-ink-700">{color.value}</span>
                </div>
              ))}
            </div>
          )}
          <p className="mt-4 text-xs text-ink-500">Mode terindikasi: {report.colors.modeGuess}</p>
        </div>

        <div className="px-6 py-6">
          <SectionHeading>Tipografi</SectionHeading>
          {report.fonts.length === 0 ? (
            <p className="text-sm text-ink-500">Tidak ada font kustom yang terdeteksi.</p>
          ) : (
            <ul className="space-y-2">
              {report.fonts.map((font) => (
                <li key={font.name} className="flex items-center justify-between text-sm">
                  <span className="text-ink-900">{font.name}</span>
                  <span className="data-label text-xs text-ink-500">{font.source}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="px-6 py-6">
          <SectionHeading>Motion</SectionHeading>
          {report.motion.libraries.length === 0 ? (
            <p className="text-sm text-ink-500">Tidak ada library motion yang dikenali.</p>
          ) : (
            <div className="mb-3 flex flex-wrap gap-2">
              {report.motion.libraries.map((lib) => (
                <span
                  key={lib.name}
                  className="flex items-center gap-2 rounded-full border border-ink-100 px-3 py-1.5 text-xs text-ink-700"
                >
                  {lib.name}
                  <ConfidenceTag level={lib.confidence} />
                </span>
              ))}
            </div>
          )}
          {report.motion.cssSignals.length > 0 && (
            <p className="text-xs text-ink-500">Sinyal CSS: {report.motion.cssSignals.join(', ')}</p>
          )}
        </div>

        <div className="px-6 py-6">
          <SectionHeading>Stack tebakan</SectionHeading>
          {report.stack.length === 0 ? (
            <p className="text-sm text-ink-500">Belum ada stack yang teridentifikasi jelas.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {report.stack.map((item) => (
                <span
                  key={item.name}
                  className="flex items-center gap-2 rounded-full border border-ink-100 px-3 py-1.5 text-xs text-ink-700"
                >
                  {item.name}
                  <ConfidenceTag level={item.confidence} />
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="px-6 py-6">
          <SectionHeading>Sinyal layout</SectionHeading>
          <ul className="space-y-1.5 text-sm text-ink-700">
            {report.layout.signals.map((signal, index) => (
              <li key={index} className="flex items-start gap-2">
                <i className="fa-solid fa-chevron-right mt-1 text-[10px] text-ink-300" />
                {signal}
              </li>
            ))}
          </ul>
        </div>

        <div className="px-6 py-6">
          <SectionHeading>Assets</SectionHeading>
          <dl className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
            <div>
              <dt className="text-ink-500">Script</dt>
              <dd className="data-label text-ink-900">{report.assets.scripts}</dd>
            </div>
            <div>
              <dt className="text-ink-500">Stylesheet</dt>
              <dd className="data-label text-ink-900">{report.assets.stylesheets}</dd>
            </div>
            <div className="col-span-2">
              <dt className="text-ink-500">Favicon</dt>
              <dd className="truncate text-ink-900">{report.assets.favicon}</dd>
            </div>
          </dl>
          {report.assets.externalDomains.length > 0 && (
            <p className="mt-3 text-xs text-ink-500">
              Domain eksternal: {report.assets.externalDomains.join(', ')}
            </p>
          )}
        </div>

        {report.notes.length > 0 && (
          <div className="bg-ink-100/40 px-6 py-5">
            {report.notes.map((note, index) => (
              <p key={index} className="flex items-start gap-2 text-xs text-ink-500">
                <i className="fa-solid fa-circle-info mt-0.5 text-ink-300" />
                {note}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
