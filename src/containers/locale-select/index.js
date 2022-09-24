import React, {useMemo} from "react";
import useTranslate from "@src/hooks/use-translate";
import CustomSelect from '@src/components/elements/custom-select';

function LocaleSelect() {

  const {lang, setLang} = useTranslate();

  const options = {
    lang: useMemo(() => ([
      {value: 'ru', title: 'Русский', code: "RU"},
      {value: 'en', title: 'English', code: "EN"},
    ]), [])
  };

  return (
    <CustomSelect onChange={setLang} value={lang} options={options.lang}/>
  );
}

export default React.memo(LocaleSelect);
