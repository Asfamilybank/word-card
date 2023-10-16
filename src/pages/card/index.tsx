import { useCallback, useMemo, useRef, useState } from "react";
import { useLoginContext } from "../../context/login";

import "./index.css";
import CardList, { CardStatus } from "../../components/CardList";

const cardList = [
  { id: 1, content: "abandon" },
  { id: 2, content: "balance" },
  { id: 3, content: "card" },
];

const CardPage = () => {
  const [current, setCurrent] = useState(0);
  const [status, setStatus] = useState<CardStatus>(CardStatus.INIT);
  const { user } = useLoginContext();

  const handleEdit = useCallback(() => {
    switch (status) {
      case CardStatus.INIT:
        setStatus(CardStatus.READ);
        break;
      case CardStatus.READ:
        setStatus(CardStatus.EDIT);
        break;
      case CardStatus.EDIT:
        setStatus(CardStatus.READ);
        break;
      default:
        break;
    }
  }, [status]);

  const buttonLabel = useMemo(() => {
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
  }, [status]);

  return (
    <section className="card_page">
      <p>Login: {user ? user.username : "not login"}</p>
      <CardList
        current={current}
        setCurrent={setCurrent}
        list={cardList}
        status={status}
      />
      <div className="button-group">
        <button>×</button>
        <button onClick={handleEdit}>{buttonLabel}</button>
      </div>
    </section>
  );
};

export default CardPage;
