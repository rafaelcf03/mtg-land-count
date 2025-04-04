import {
  useForm,
  SubmitHandler,
  Controller,
  useWatch,
  FieldErrors,
} from "react-hook-form";
import {
  Box,
  Button,
  Checkbox,
  Container,
  MenuItem,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { zodResolver } from "@hookform/resolvers/zod";
import "./App.css";
import Header from "./components/Header";
import api from "./providers/mtg-api";
import {
  formDefaultValues,
  formSchema,
  FormSchema,
} from "./schemas/formSchema";
import TooltipComponent from "./components/Tooltip";
import translate from "./utils/dictionary";
import HeaderLabel from "./components/HeaderLabel";
import { useEffect, useState } from "react";
import FormFooter from "./components/FormFooter";

function App() {
  const [totalLands, setTotalLands] = useState<number>(0);
  const nCardDeckOptions = [60, 80, 99];
  const {
    handleSubmit,
    control,
    setValue,
    register,
    formState: { isSubmitting, errors },
  } = useForm<FormSchema>({
    mode: "all",
    defaultValues: formDefaultValues,
    resolver: zodResolver(formSchema),
  });
  const formErrors: FieldErrors<Extract<FormSchema, { hasDecklist: true }>> =
    errors;

  const isDecklistChecked = useWatch({ control, name: "hasDecklist" });
  const nCardDeck = useWatch({ control, name: "nCardDeck" });

  useEffect(() => {
    // Força um re-render ao detectar mudanças no valor
  }, [nCardDeck]);

  const calculateLandCount = (data: FormSchema): number => {
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

    return parseFloat(landCount.toFixed(2));
  };

  const onSubmit: SubmitHandler<FormSchema> = async (data: FormSchema) => {
    const total = calculateLandCount(data);
    setTotalLands(total);
    console.log("terrenos necessários: ", total, "\ndata: ", data);
  };

  const handleSelectChange = (value: number) => {
    if (value == 80) {
      setValue("companion", true);
    } else {
      setValue("companion", false);
    }
  };

  const transformDeckListString = async (decklist: string) => {
    let cardsCMC: any[] = [];

    const cardsArray = decklist.split("\n");
    const trimmedLines = cardsArray.map((line) => line.trim());
    // filtra apenas as linhas com nomes de cartas,
    // desconsiderando palavras chaves como "commander", "deck", etc.
    const filteredLines = trimmedLines.filter((line) =>
      /^\d+\s+([a-zA-Z0-9\s,\'\-\//]+)(?:\s+\([A-Za-z0-9]+\)\s+\d+)?\s*$/.test(
        line
      )
    );
    const cards = filteredLines.map((card) =>
      card.replace(
        /^\d+\s+([a-zA-Z0-9\s,\'\-\//]+)(?:\s+\([A-Za-z0-9]+\)\s+\d+)?\s*$/,
        "$1"
      )
    );

    console.log(cards);

    if (cards.length > 1) {
      const requests = cards.map(async (card) => {
        const formatedString = card
          .toLowerCase()
          .replace(/\s*\/\/\s*/g, " ")
          .replace(/[\s,]+/g, "+");

        const response = await api.get(`/cards/named?fuzzy=${formatedString}`);

        return response.data.cmc;
      });

      cardsCMC = await Promise.all(requests);

      const total = cardsCMC.reduce((acc, item) => acc + item, 0);
      console.log("Total:", total);

      const average = (total / cardsCMC.length).toFixed(2);
      console.log("Média de CMC:", average);
      setValue("avgManaValue", parseFloat(average));
    }
  };

  return (
    <Container disableGutters className="main-body">
      <Header />

      <form noValidate onSubmit={handleSubmit(onSubmit)} className="form">
        <Box className="field-section-tooltip">
          <HeaderLabel>
            <p className="text">Formato n-cartas</p>
            <TooltipComponent title={translate("n-cards")} />
          </HeaderLabel>

          <Controller
            control={control}
            name="nCardDeck"
            render={({ field: { onChange } }) => (
              <TextField
                select
                variant="outlined"
                defaultValue={60}
                onChange={(e) => {
                  onChange(parseFloat(e.target.value));
                  handleSelectChange(parseFloat(e.target.value));
                }}
                fullWidth
              >
                {nCardDeckOptions.map((value) => (
                  <MenuItem key={value} value={value}>
                    {value}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Box>

        <Box className="decklist-section">
          <HeaderLabel>
            <p className="text">Custo médio</p>
            <TooltipComponent title={translate("avg-mana-value")} />
          </HeaderLabel>
          <div className="decklist-section-field">
            <Controller
              control={control}
              name="avgManaValue"
              render={({ field: { onChange, value } }) => (
                <TextField
                  type="number"
                  variant="outlined"
                  onChange={(e) => {
                    onChange(parseFloat(e.target.value));
                  }}
                  value={value}
                />
              )}
            />

            <div className="decklist-section-checkbox">
              <p className="text">Decklist</p>
              <Controller
                control={control}
                name="hasDecklist"
                defaultValue={false}
                render={({ field: { onChange, value } }) => (
                  <Checkbox
                    onChange={() => {
                      onChange(!value);
                    }}
                    checked={value}
                    color="violet"
                  />
                )}
              />
            </div>
          </div>
        </Box>

        {isDecklistChecked && (
          <Controller
            control={control}
            name="deckList"
            render={({ field: { onChange, value } }) => (
              <TextField
                type="text"
                label="Lista de cartas"
                variant="outlined"
                multiline
                rows={4}
                onChange={(e) => {
                  onChange(e.target.value);
                  transformDeckListString(e.target.value);
                }}
                value={value}
                helperText={formErrors.deckList?.message}
                error={!!formErrors.deckList}
              />
            )}
          />
        )}

        <Box className="field-section-tooltip">
          <HeaderLabel>
            <p className="text">Cheap draws</p>
            <TooltipComponent title={translate("n-cheap-draw")} />
          </HeaderLabel>
          <Controller
            control={control}
            name="nCheapDraw"
            render={({ field: { onChange, value } }) => (
              <TextField
                type="number"
                variant="outlined"
                onChange={(e) => {
                  onChange(parseInt(e.target.value));
                }}
                value={value}
                fullWidth
              />
            )}
          />
        </Box>

        <Box className="field-section-tooltip">
          <HeaderLabel>
            <p className="text">Cheap mana ramp</p>
            <TooltipComponent title={translate("n-cheap-mr")} />
          </HeaderLabel>
          <Controller
            control={control}
            name="nCheapManaRamp"
            render={({ field: { onChange, value } }) => (
              <TextField
                type="number"
                variant="outlined"
                onChange={(e) => {
                  onChange(parseInt(e.target.value));
                }}
                value={value}
                fullWidth
              />
            )}
          />
        </Box>

        <Box className="field-section-tooltip">
          <HeaderLabel>
            <p className="text">Modais que entram virados</p>
            <TooltipComponent title={translate("nonMythicLand")} />
          </HeaderLabel>
          <Controller
            control={control}
            name="nNonMythicLand"
            render={({ field: { onChange, value } }) => (
              <TextField
                type="number"
                variant="outlined"
                onChange={(e) => {
                  onChange(parseInt(e.target.value));
                }}
                value={value}
                fullWidth
              />
            )}
          />
        </Box>

        <Box className="field-section-tooltip">
          <HeaderLabel>
            <p className="text">Modais que entram desvirados</p>
            <TooltipComponent title={translate("mythicLand")} />
          </HeaderLabel>
          <Controller
            control={control}
            name="nMythicLand"
            render={({ field: { onChange, value } }) => (
              <TextField
                type="number"
                variant="outlined"
                onChange={(e) => {
                  onChange(parseInt(e.target.value));
                }}
                value={value}
                fullWidth
              />
            )}
          />
        </Box>

        <HeaderLabel>
          <p className="text">Companion</p>
          <TooltipComponent title={translate("companion")} />
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
        </HeaderLabel>

        <Button
          type="submit"
          variant="contained"
          disabled={isSubmitting}
          color="violet"
          sx={{ paddingY: 1.5 }}
        >
          Enviar
        </Button>
      </form>
      {totalLands > 0 && <FormFooter total={totalLands} />}
    </Container>
  );
}

export default App;
