type JsonLdProps = {
  data: Record<string, unknown> | Record<string, unknown>[];
};

// Escapes "<" so content strings can never close the script tag early.
export default function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
