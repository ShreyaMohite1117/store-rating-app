// fields: [{ key, label, type: 'text' | 'select', options? }]
// values: { [key]: value }
export default function FilterBar({ fields, values, onChange, onReset }) {
  return (
    <div className="filter-bar">
      {fields.map((f) => (
        <div className="filter-field" key={f.key}>
          <label htmlFor={`filter-${f.key}`}>{f.label}</label>
          {f.type === 'select' ? (
            <select
              id={`filter-${f.key}`}
              value={values[f.key] || ''}
              onChange={(e) => onChange(f.key, e.target.value)}
            >
              <option value="">All</option>
              {f.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              id={`filter-${f.key}`}
              type="text"
              value={values[f.key] || ''}
              placeholder={f.placeholder || `Filter by ${f.label.toLowerCase()}`}
              onChange={(e) => onChange(f.key, e.target.value)}
            />
          )}
        </div>
      ))}
      <button type="button" className="btn btn-ghost filter-reset" onClick={onReset}>
        Clear filters
      </button>
    </div>
  );
}
