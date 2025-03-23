import { useForm, SubmitHandler, Controller } from "react-hook-form";
import {
  Button,
  MenuItem,
  Switch,
  TextField,
  ThemeProvider,
} from "@mui/material";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import "./App.css";
import { theme } from "./themes/theme-config";
import Header from "./components/Header";

const schema = z.object({
  nCardDeck: z.number(),
  avgManaValue: z.number(),
  nCheapDraw: z.number().int(),
  nCheapManaRamp: z.number().int(),
  nNonMythicLand: z.number().int(),
  nMythicLand: z.number().int(),
  companion: z.boolean(),
});

type FormFields = z.infer<typeof schema>;

function App() {
  const nCardDeckOptions = [60, 80, 99];

  const {
    handleSubmit,
    control,
    setValue,
    formState: { isSubmitting },
  } = useForm<FormFields>({
    defaultValues: {
      nCardDeck: 60,
      avgManaValue: 0,
      nCheapDraw: 0,
      nCheapManaRamp: 0,
      nNonMythicLand: 0,
      nMythicLand: 0,
      companion: false,
    },
    resolver: zodResolver(schema),
  });

  const calculateLandCount = (data: FormFields): number => {
    let landCount = 0;

    if (data.nCardDeck == 99) {
      landCount =
        31.42 +
        3.13 * data.avgManaValue -
        0.28 * (data.nCheapDraw + data.nCheapManaRamp) +
        data.nNonMythicLand * 0.38 +
        data.nMythicLand * 0.74;
    } else if (data.nCardDeck == 80) {
      landCount =
        26.43 +
        2.53 * data.avgManaValue -
        0.28 * (data.nCheapDraw + data.nCheapManaRamp) +
        data.nNonMythicLand * 0.38 +
        data.nMythicLand * 0.74;
    } else {
      landCount =
        19.59 +
        1.9 * data.avgManaValue -
        0.28 * (data.nCheapDraw + data.nCheapManaRamp) +
        0.27 * Number(data.companion) +
        data.nNonMythicLand * 0.38 +
        data.nMythicLand * 0.74;
    }

    return landCount;
  };

  const onSubmit: SubmitHandler<FormFields> = async (data: FormFields) => {
    const total = calculateLandCount(data);
    console.log("total: ", total, "\ndata: ", data);
  };

  const handleSelectChange = (value: number) => {
    if (value == 80) {
      setValue("companion", true);
    } else {
      setValue("companion", false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <main className="main-body">
        <Header />
        <form noValidate onSubmit={handleSubmit(onSubmit)} className="form">
          <Controller
            control={control}
            name="nCardDeck"
            render={({ field: { onChange } }) => (
              <TextField
                select
                label="Formato n-cartas"
                variant="outlined"
                defaultValue={60}
                onChange={(e) => {
                  onChange(parseFloat(e.target.value));
                  handleSelectChange(parseFloat(e.target.value));
                }}
              >
                {nCardDeckOptions.map((value) => (
                  <MenuItem key={value} value={value}>
                    {value}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />

          <Controller
            control={control}
            name="avgManaValue"
            render={({ field: { onChange, value } }) => (
              <TextField
                type="number"
                label="Custo médio"
                variant="outlined"
                onChange={(e) => {
                  onChange(parseFloat(e.target.value));
                }}
                value={value}
              />
            )}
          />

          <Controller
            control={control}
            name="nCheapDraw"
            render={({ field: { onChange, value } }) => (
              <TextField
                type="number"
                label="Cheap draws"
                variant="outlined"
                onChange={(e) => {
                  onChange(parseInt(e.target.value));
                }}
                value={value}
              />
            )}
          />

          <Controller
            control={control}
            name="nCheapManaRamp"
            render={({ field: { onChange, value } }) => (
              <TextField
                type="number"
                label="Cheap mana ramp"
                variant="outlined"
                onChange={(e) => {
                  onChange(parseInt(e.target.value));
                }}
                value={value}
              />
            )}
          />

          <Controller
            control={control}
            name="nNonMythicLand"
            render={({ field: { onChange, value } }) => (
              <TextField
                type="number"
                label="Modais que entram virados"
                variant="outlined"
                onChange={(e) => {
                  onChange(parseInt(e.target.value));
                }}
                value={value}
              />
            )}
          />

          <Controller
            control={control}
            name="nMythicLand"
            render={({ field: { onChange, value } }) => (
              <TextField
                type="number"
                label="Modais que entram desvirados"
                variant="outlined"
                onChange={(e) => {
                  onChange(parseInt(e.target.value));
                }}
                value={value}
              />
            )}
          />

          <label className="switch-label">
            <p className="text">Companion</p>
            <Controller
              control={control}
              name="companion"
              defaultValue={false}
              render={({ field: { onChange, value } }) => (
                <Switch
                  onChange={() => {
                    onChange(!value);
                  }}
                  checked={value}
                  size="medium"
                  color="violet"
                />
              )}
            />
          </label>

          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            color="violet"
          >
            Enviar
          </Button>
        </form>
      </main>
    </ThemeProvider>
  );
}

export default App;
