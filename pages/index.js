import Head from "next/head";
import LoadFonts from "~/utilities/Fonts";
import Header from "~/components/Header";
import Block from "~/components/Block";
import EntryBox from "~/components/EntryBox";
import moment from "moment";

const marked = require("marked");
marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: false,
  smartLists: true,
  smartypants: false
});

class Index extends React.Component {
  componentDidMount() {
    LoadFonts();
  }
  state = { newEntries: [] };
  handleNewEntry = contents => {
    this.setState({
      newEntries: [
        ...this.state.newEntries,
        {
          contents,
          timestamp: moment().format("h:mm A")
        }
      ]
    });
  };
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

          <Header>Deciding the technologies</Header>
          <Block timestamp="05:11 PM">
            Working on building an app with{" "}
            <a href="https://zeit.co/blog/next4">next.js</a>
          </Block>
          <Block>Hopefully I learn some more about SSR along the way</Block>

          <Block>
            Deployments done via zeit.co's other acclaimed product,{" "}
            <a href="https://now.sh">now</a>
          </Block>
          <Block>
            The source code is available on{" "}
            <a href="https://github.com/pringshia/memopad">Github</a>
          </Block>

          <Block timestamp="05:11 PM">
            Also trying out <a href="https://tailwindcss.com/">Tailwind CSS</a>
          </Block>

          <Block timestamp="12:11 PM">
            So far feeling a bit of a learning curve and running into
            frustration getting things pixel perfect
          </Block>

          <Header>Looking forward, thinking of requirements</Header>
          <Block timestamp="12:11 PM">
            I'd like to focus on the CMS-y parts of this. Need to work on a way
            to quickly add entries.
          </Block>
          <Block>Going to need some sort of input area</Block>
          <Block>The ability to embed images would be cool too</Block>
          {this.state.newEntries.map((entry, idx) => (
            <Block timestamp={entry.timestamp} key={idx}>
              <div
                dangerouslySetInnerHTML={{ __html: marked(entry.contents) }}
              />
            </Block>
          ))}
          <EntryBox onSubmit={this.handleNewEntry} />
        </div>
      </div>
    );
  }
}

export default Index;
