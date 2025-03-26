import { IconButton, Tooltip } from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

type TooltipoProps = {
  title: string;
};

function TooltipComponent({ title }: TooltipoProps) {
  return (
    <Tooltip title={title}>
      <IconButton>
        <HelpOutlineIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  );
}

export default TooltipComponent;
