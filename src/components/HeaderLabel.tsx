import "../App.css";

type HeaderLabelProps = {
  children: React.ReactNode;
};

function HeaderLabel({ children }: HeaderLabelProps) {
  return <div className="header-label">{children}</div>;
}

export default HeaderLabel;
