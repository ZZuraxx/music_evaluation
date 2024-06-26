import { useState, useEffect } from "react";
import "./style.css";
import config from "../../params/config";
import InputMask from "react-input-mask";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

//rating
import { Rating, ThinStar } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";

//import MaterialInput from '@material-ui/core/Input';
import { registerLocale } from "react-datepicker";
import { ru } from "date-fns/locale/ru";
registerLocale("ru-RU", ru);

export default function Form({ nameForm, arValue = {} }) {
  //const shemaForm = schema[nameForm];
  const [schema, setSchema] = useState(null);
  const [formValue, setFormValue] = useState({});
  const [url, setUrl] = useState(config.api + "post/" + nameForm + "/");
  const [formName, setFormName] = useState(nameForm);
  const [edit, setEdit] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [startDate, setStartDate] = useState(new Date());
  //rating
  const [rating, setRating] = useState({});
  const myStyles = {
    itemShapes: ThinStar,
    activeFillColor: "#ffb700",
    inactiveFillColor: "#fbf1a9",
  };

  useEffect(() => {
    async function fetchSchema() {
      const response = await fetch(config.api + "get/schema/" + formName + "/");
      const answer = await response.json();

      for (let key in answer) {
        let el = answer[key];

        if (el.type === "DBRef") {
          let mdb = await fetch(config.api + "get/" + el.collection + "/");
          let ar = await mdb.json();
          answer[key].arList = ar.data;
        }
      }

      setSchema(answer);
    }
    setFormName(nameForm);
    setUrl(config.api + "post/" + nameForm + "/");
    fetchSchema();
    if (Object.keys(arValue).length > 0) {
      setFormValue(arValue);
      setEdit(true);
      setDisabled(false);
    }
  }, [nameForm, arValue, formName, rating]);

  function renderForm(data = {}, ar = {}, rand = 0) {
    let formElements = [];

    for (let i in data) {
      let newRow = data[i];

      newRow.code = i;
      newRow.value = ar[i] ? ar[i] : ""; //todo: Скорректировать под select

      switch (newRow.type) {
        case "String":
          newRow.fieldType = "text";
          newRow.field = "field";
          break;

        case "Number":
          newRow.fieldType = "number";
          newRow.field = "field";
          break;

        case "Phone":
          newRow.fieldType = "tel";
          newRow.field = "tel";
          break;

        case "Email":
          newRow.fieldType = "email";
          newRow.field = "field";
          break;

        case "DBRef":
          newRow.fieldType = "select";
          newRow.field = "select";
          newRow.list = renderSelect(newRow);
          break;

        case "Date":
          newRow.fieldType = "date";
          newRow.field = "date";
          break;

        case "File":
          newRow.fieldType = "file";
          newRow.field = "file";
          break;

        case "Rating":
          newRow.fieldType = "rating";
          newRow.field = "rating";
          break;
        case "Rating_Overage":
          newRow.fieldType = "rating_overage";
          newRow.field = "rating_overage";
          break;

        case "Hidden":
        default:
          newRow.fieldType = "hidden";
          newRow.field = "field";
          break;
      }

      formElements.push(newRow);
    }

    return (
      <>
        {formElements.map((item, index) => (
          <label key={index} htmlFor={item.code}>
            { item.editable &&
                <span>
                {item.loc} {item.require && "*"}
                </span>
            }
            {item.field === "field" && (
              <input
                type={item.fieldType}
                required={item.require ? true : false}
                defaultValue={item.value && item.value}
                onChange={item.sim && callMethod}
                readOnly={item.readOnly && true}
                step={item.fieldType === "number" ? item.step : null}
                name={item.code}
              />
            )}

            {item.field === "rating_overage" && (
              <>
                <Rating
                  readOnly
                  style={{ maxWidth: 200 }}
                  value={rating[item.code]}
                  itemStyles={myStyles}
                />
                <input
                  type="hidden"
                  name={item.code}
                  defaultValue={rating[item.code]}
                />
              </>
            )}

            {item.field === "rating" && (
              <>
                <Rating
                  style={{ maxWidth: 200 }}
                  value={rating[item.code]}
                  onChange={(selectedValue) => {
                    let ob = {};
                    ob[item.code] = selectedValue;
                    setRating((prevData) => ({
                      ...prevData,
                      ...ob,
                    }));
                    setTimeout(Overage, 500);
                  }}
                  itemStyles={myStyles}
                />
                <input
                  className="stars"
                  type="hidden"
                  name={item.code}
                  defaultValue={rating[item.code]}
                />
              </>
            )}

            {item.field === "tel" && (
              <InputMask
                required={item.require ? true : false}
                defaultValue={item.value && item.value}
                name={item.code}
                mask="+7(999)-999-99-99"
                maskChar="_"
              />
            )}

            {item.field === "file" && (
                <input type="file" name={item.code} />
            )}

            {item.field === "select" && (
              <select name={item.code}>{item.list}</select>
            )}

            {item.field === "date" && (
              <DatePicker
                selected={startDate}
                locale="ru-RU"
                dateFormat="dd.MM.yyyy"
                name={item.code}
                required={item.require && true}
                defaultValue={item.value && item.value}
                onChange={(date) => setStartDate(date)}
              />
            )}
          </label>
        ))}
      </>
    );
  }

  function Overage() {
    let form = document.querySelector("form.editForm");
    let arFields = form.querySelectorAll("input.stars");

    let rifma = parseInt(arFields[0].value) || 0;
    let rithmic = parseInt(arFields[1].value) || 0;
    let ind = parseInt(arFields[2].value) || 0;
    let atmos = parseInt(arFields[3].value) || 0;

    let value = parseFloat((rifma + rithmic + ind + atmos) / 4);

    let ob = {};
    ob.OVERAGE = value;

    console.log(rifma, rithmic, ind, atmos);
    console.log(value);
    setRating((prevData) => ({ ...prevData, ...ob }));
  }

  function callMethod(event) {
    let form = event.target.closest("form");
    let name = event.target.name;
    let obSchema = schema;
    let curSchemaSim = obSchema[name].sim;
    let total = form.querySelector("input[name=" + curSchemaSim + "]");
    let value = 0;
    if (curSchemaSim) {
      let method = obSchema[curSchemaSim].method;
      let arSimFields = obSchema[curSchemaSim].fields;
      let arFields = [];

      arSimFields.forEach((item) => {
        arFields.push(form.querySelector("input[name=" + item + "]"));
      });

      switch (method) {
        case "MULTIPLY":
          value = arFields[0].value * arFields[1].value;
          break;
        case "OVERAGE":
          value = parseFloat(
            (parseInt(arFields[0].value) +
              parseInt(arFields[1].value) +
              parseInt(arFields[2].value) +
              parseInt(arFields[3].value)) /
              4
          );
      }

      total.value = value;
    }
  }

  function renderSelect(ar) {
    let list = ar.arList;
    let value = ar.value._id;

    return (
      <>
        <option key="0" value="0">
          Выберите...
        </option>
        {list.map((item) => (
          <option selected={value === item._id} key={item._id} value={item._id}>
            {item.TITLE}
          </option>
        ))}
      </>
    );
  }

  function resetForm(event) {
    event.preventDefault();
    setFormValue({});
    renderForm(schema, {});
    setEdit(false);
    setDisabled(true);
  }

  function checkRequired(event) {
    let form = event.target.closest("form"); //Ищет ближайшего родителя по тегу, классу или идентификатору
    let formElements = form.querySelectorAll("input, select, textarea");
    let error = 0;

    formElements.forEach((item) => {
      if (item.required === true && (item.value == "0" || item.value === "")) {
        setDisabled(true);
        error++;
      }
    });

    if (error === 0) setDisabled(false);
  }

  return (
    <form
      method="POST"
      action={url}
      onChange={checkRequired}
      className="editForm"
      encType="multipart/form-data"
    >
      {renderForm(schema, formValue)}

      <button disabled={disabled && disabled}>
        {!edit && "Сохранить"}
        {edit && "Изменить"}
      </button>
      <button onClick={resetForm}>Сбросить</button>
    </form>
  );
}
