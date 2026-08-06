// Renders a schema.org JSON-LD block. Escapes '<' so a stray "</script>" or tag
// in the data (e.g. an event title) can't break out of the script element.
export default function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  )
}
