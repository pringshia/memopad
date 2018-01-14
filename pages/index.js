import Head from "next/head";
import LoadFonts from "~/utilities/Fonts";
import LogPad from "~/components/LogPad";

class Index extends React.Component {
  componentDidMount() {
    LoadFonts();
  }

  static async getInitialProps({ query }) {
    return { page: query.page || "" };
  }

  render() {
    return (
      <div>
        <div className="p-8 pt-16">
          <Head>
            <title>Memopad</title>
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"
            />
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
          </Head>
          <style jsx global>{`
            body {
              font: 400 18px/24px "gentium book basic", serif;
              color: #333;
              -webkit-font-smoothing: antialiased;
            }
            .dosis {
              font-family: "Dosis", sans-serif;
            }
            a,
            a:visited {
              color: #0091ff;
            }
            body {
              opacity: 0;
              padding-bottom: 75px;
            }
            .fonts-loaded body,
            .fonts-failed body {
              opacity: 1;
            }
            .title {
              margin: 90px 75px 60px;
            }
          `}</style>

          <h1 className="title dosis text-4xl uppercase">Memopad</h1>

          <LogPad page={this.props.page} />
        </div>
      </div>
    );
  }
}

export default Index;
