import Head from "next/head";

export default () => (
  <div className="p-8 pt-16">
    <Head>
      <title>Memopad</title>
      <link
        href="https://cdn.jsdelivr.net/npm/tailwindcss/dist/tailwind.min.css"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css?family=Gentium+Book+Basic:400,400i,700,700i"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css?family=Dosis:500"
        rel="stylesheet"
      />

      <style jsx global>{`
        body {
          font: 400 20px/24px "gentium book basic", serif;
          color: #333;
        }
        h1,
        span {
          font-family: "Dosis", sans-serif;
        }
      `}</style>
    </Head>
    <h1 className="mb-6 text-4xl uppercase">Memopad</h1>

    <div className="mb-3">
      <p>
        <span className="text-sm pr-4">05:11 PM</span>Working on an app with
        next.js
      </p>
    </div>

    <div className="mb-3">
      <p>
        <span className="text-sm pr-4">05:11 PM</span>Also trying out Tailwind
        css
      </p>
    </div>

    <div className="mb-3">
      <p>
        <span className="text-sm pr-4">05:11 PM</span>Haven't used either before
        but learning
      </p>
    </div>
  </div>
);
