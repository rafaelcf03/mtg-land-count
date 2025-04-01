import "../App.css";
import translate from "../utils/dictionary";
import TooltipComponent from "./Tooltip";

type FormFooterProps = {
  total: number;
};

function FormFooter({ total }: FormFooterProps) {
  return (
    <div className="footer-div">
      <p className="footer-text">Número de terrenos necessários: {total}</p>
      <TooltipComponent title={translate("info")} />
    </div>
  );
}

export default FormFooter;
