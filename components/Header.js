const Header = props => {
  return (
    <React.Fragment>
      <style jsx>{`
        .header {
          margin: 35px 75px 10px;
          color: orangered;
          font-size: 20px;
          padding-bottom: 5px;
          border-bottom: 1px dotted #ddd;
        }
      `}</style>
      <div className="header dosis">{props.children}</div>
    </React.Fragment>
  );
};

export default Header;
