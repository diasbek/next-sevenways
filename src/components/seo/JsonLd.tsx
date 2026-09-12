/** JSON-LD for crawlers — plain script in RSC (official Next App Router pattern). */
export function JsonLd({
  data,
  id = "json-ld",
}: {
  data: unknown;
  id?: string;
}) {
  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
