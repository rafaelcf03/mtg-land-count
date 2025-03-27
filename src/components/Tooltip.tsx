import { IconButton, Tooltip } from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import "../App.css";

type TooltipProps = {
  title: string;
};

function TooltipComponent({ title }: TooltipProps) {
  return (
    <Tooltip
      arrow
      title={<p className="tooltip-text">{title}</p>}
      placement="top"
    >
      <IconButton>
        <HelpOutlineIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  );
}

export default TooltipComponent;
