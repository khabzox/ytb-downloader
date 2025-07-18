export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20" style={{ backgroundColor: "var(--background)" }}>
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2
            className="mb-4 text-3xl font-bold md:text-4xl"
            style={{ color: "var(--foreground)" }}
          >
            How It Works
          </h2>
          <p className="text-xl" style={{ color: "var(--muted-foreground)" }}>
            Download YouTube videos in just 3 simple steps
          </p>
        </div>

        <div className="mx-auto max-w-4xl">
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: "1",
                title: "Copy URL",
                desc: "Copy the YouTube video URL from your browser's address bar",
              },
              {
                step: "2",
                title: "Paste & Click",
                desc: "Paste the URL in our input field and click the download button",
              },
              {
                step: "3",
                title: "Download",
                desc: "Choose your preferred quality and format, then download instantly",
              },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div
                  className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold text-white"
                  style={{ backgroundColor: "var(--primary)" }}
                >
                  {item.step}
                </div>
                <h3 className="mb-3 text-xl font-semibold" style={{ color: "var(--foreground)" }}>
                  {item.title}
                </h3>
                <p style={{ color: "var(--muted-foreground)" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
