import { useCallback, useEffect, useMemo, useState } from "react";
import { useLoginContext } from "../../context/login";

import "./index.css";
import useLocalStorage from "../../hooks/useLocalStorage";
import { UserType } from "../../const";

export interface Card {
  id: number;
  content: string;
}

// Card Status
export enum CardStatus {
  // front
  INIT,
  // back
  READ,
  // edit
  EDIT,
}

// default Card list
export const defaultCardList: Card[] = [
  { id: 1, content: "abandon" },
  { id: 2, content: "balance" },
  { id: 3, content: "card" },
];

const CardPage = () => {
  // current Card index
  const [current, setCurrent] = useState(0);

  // card status
  const [status, setStatus] = useState<CardStatus>(CardStatus.INIT);

  // card list
  const [cardList, setCardList] = useLocalStorage("list", defaultCardList);

  const { user } = useLoginContext();

  // edit box data to be saved
  const [value, setValue] = useState("");

  // change the original value of the edit box according to current changes
  useEffect(() => {
    if (current >= 0 && current < cardList.length) {
      const currentValue = cardList[current];
      setValue(currentValue.content);
    }
  }, [current, cardList]);

  // switch to previous card
  const handlePrevious = useCallback(() => {
    setStatus(CardStatus.INIT);
    setCurrent(current - 1);
  }, [current, setCurrent, setStatus]);

  // switch to next card
  const handleNext = useCallback(() => {
    setStatus(CardStatus.INIT);
    setCurrent(current + 1);
  }, [current, setCurrent, setStatus]);

  // delete current card
  const handleDelete = useCallback(() => {
    setStatus(CardStatus.INIT);
    setCardList(cardList.slice(0, current).concat(cardList.slice(current + 1)));
  }, [cardList, current, setCardList]);

  // edit button
  const handleEdit = useCallback(() => {
    if (user?.userType === UserType.ADMIN) {
      switch (status) {
        // to back
        case CardStatus.INIT:
          setStatus(CardStatus.READ);
          break;
        // to edit box
        case CardStatus.READ:
          setStatus(CardStatus.EDIT);
          break;
        // to save
        case CardStatus.EDIT:
          const list = [...cardList];
          list[current].content = value;
          setCardList(list);
          setStatus(CardStatus.READ);
          break;
        default:
          break;
      }
    } else {
      switch (status) {
        // to back
        case CardStatus.INIT:
          setStatus(CardStatus.READ);
          break;
        // to front
        case CardStatus.READ:
          setStatus(CardStatus.INIT);
          break;
        default:
          break;
      }
    }
  }, [cardList, current, setCardList, status, user, value]);

  // add function
  const handleAdd = useCallback(() => {
    const list = [...cardList];
    // Get the last card id and plus 1   or   default id
    const id = list[list.length - 1]?.id + 1 ?? 1;
    list.push({
      id,
      content: "something?",
    });
    setCardList(list);
    setStatus(CardStatus.EDIT);
  }, [cardList, setCardList]);

  // edit button label
  const buttonLabel = useMemo(() => {
    if (user?.userType === UserType.ADMIN) {
      switch (status) {
        case CardStatus.INIT:
          return "Read";
        case CardStatus.READ:
          return "Edit";
        case CardStatus.EDIT:
          return "Save";
        default:
          return "";
      }
    } else {
      switch (status) {
        case CardStatus.INIT:
          return "Read";
        case CardStatus.READ:
          return "Back";
        default:
          return "";
      }
    }
  }, [status, user]);

  return (
    <section className="card_page">
      {/* username */}
      <p>Login: {user?.username ?? "not login"}</p>

      {/* card list */}
      <div className="card_list_root">
        {/* previous button */}
        <button
          className="card_list_button"
          disabled={current === 0}
          onClick={handlePrevious}
        >
          {"<"}
        </button>
        {/* card list main */}
        <div className="card_list_container">
          <div
            className="card_list"
            style={{
              marginLeft: `${(1 - current) * 270}px`,
            }}
          >
            {cardList.map((item, index) => (
              // card
              <div
                key={item.id}
                className={`card ${index === current ? "card-active" : ""} ${
                  status !== CardStatus.INIT ? "card-is_back" : ""
                }`}
              >
                <div className="card-front">{item.id}</div>
                <div className="card-back">
                  {status === CardStatus.EDIT ? (
                    <textarea
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                    />
                  ) : (
                    item.content
                  )}
                </div>
              </div>
            ))}
            {/* add card */}
            {user?.userType === UserType.ADMIN && (
              <div
                className={`card ${
                  current === cardList.length ? "card-active" : ""
                }`}
              >
                <div className="card-add" onClick={handleAdd}>
                  +
                </div>
              </div>
            )}
          </div>
        </div>
        {/* next button */}
        <button
          className="card_list_button"
          disabled={
            current >
            cardList.length - (user?.userType === UserType.ADMIN ? 0 : 1)
          }
          onClick={handleNext}
        >
          {">"}
        </button>
      </div>
      <div className="button-group">
        {/* delete button */}
        {user?.userType === UserType.ADMIN && (
          <button disabled={current >= cardList.length} onClick={handleDelete}>
            ×
          </button>
        )}
        {/* read, back, edit, save button */}
        <button disabled={current >= cardList.length} onClick={handleEdit}>
          {buttonLabel}
        </button>
      </div>
    </section>
  );
};

export default CardPage;
