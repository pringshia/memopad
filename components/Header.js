const Header = props => {
  return (
    <React.Fragment>
      <style jsx>{`
        .header {
          //   padding: 10px 75px;
          //   margin: 10px 0;
          margin: 35px 75px 10px;
          color: orangered;
          font-size: 20px;
          padding-bottom: 5px;
          border-bottom: 1px dotted #ddd;
        }
      `}</style>
      <div className="header">{props.children}</div>
    </React.Fragment>
  );
};

export default Header;
