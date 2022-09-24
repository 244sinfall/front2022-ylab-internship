import React from "react";
import propTypes from "prop-types";
import useTranslate from "@src/hooks/use-translate";
import LayoutHead from "@src/components/layouts/layout-head";
import LocaleSelect from "@src/containers/locale-select";
import CustomSelect from '@src/components/elements/custom-select';

function HeadContainer(props) {

  const {t} = useTranslate();

  return (
    <LayoutHead title={t(props.title)}>
      <CustomSelect options={[{code: "ME", value: "me", title: "Средиземье"},
        {code: "NA", value: "na", title: "Нарния"},
        {code: "LUmistaked", value: "lu", title: "Лукоморье"},
        {code: "AV", value: "av", title: "Авалон"},
        {code: "NL", value: "nl", title: "Неверленд"},
        {code: "SM", value: "sm", title: "Королевство Кривых Зеркал (для проверки длинного текста)"},
        {code: "EL", value: "el", title: "Эльдорадо"},
      ]}/>
      <LocaleSelect/>
    </LayoutHead>
  );
}

HeadContainer.propTypes = {
  title: propTypes.string,
}

HeadContainer.defaultProps = {
  title: 'title'
}

export default React.memo(HeadContainer);
