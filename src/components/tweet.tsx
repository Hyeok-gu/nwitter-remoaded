import styled from "styled-components";
import { ITweet } from "./timeline";
import { auth, db, storage } from "../firebase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { useState } from "react";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
  margin-bottom: 12px;
`;

const Column = styled.div``;

const Photo = styled.img`
  width: 100%;
  border-radius: 15px;
`;

const Username = styled.span`
  font-weight: 600;
  font-size: 15px;
`;

const Payload = styled.p`
  margin: 10px 0px;
  font-size: 18px;
`;

const DeleteButton = styled.button`
  background-color: tomato;
  color: white;
  font-weight: 600;
  border: 0;
  border-radius: 5px;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  cursor: pointer;
  margin-bottom: 12px;
`;
const ChangeButton = styled(DeleteButton)`
  background-color: aliceblue;
  color: #000;
  margin-left: 10px;
`;

const UpdateButton = styled(DeleteButton)`
  background-color: #00ff8c;
  color: #000;
  margin-left: 10px;
`;

const EditInput = styled.textarea`
  border: 2px solid white;
  padding: 20px;
  margin: 12px 0;
  border-radius: 12px;
  font-size: 16px;
  color: white;
  background-color: black;
  width: 100%;
  resize: none;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  &::placeholder {
    font-size: 16px;
  }
  &:focus {
    outline: none;
    border-color: #1d9bf0;
  }
`;

export default function Tweet({ username, photo, tweet, userId, id }: ITweet) {
  const user = auth.currentUser;

  const [editActive, setEditActive] = useState(false);
  const [newTweet, setNewTweet] = useState(tweet);

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewTweet(e.target.value);
  };

  const onDelete = async () => {
    const ok = confirm("정말 이 트윗을 삭제하시겠어요?");
    if (!ok || user?.uid !== userId) return;
    try {
      await deleteDoc(doc(db, "tweets", id));
      if (photo) {
        const photoRef = ref(storage, `tweets/${user.uid}/${id}`);
        await deleteObject(photoRef);
      }
    } catch (error) {
      console.log(error);
    } finally {
      //
      alert("트윗 삭제를 완료했어요");
    }
  };
  const onEdit = () => {
    if (user?.uid !== userId) return;
    try {
      setEditActive(!editActive);
    } catch (error) {
      console.log(error);
    } finally {
      setNewTweet(tweet);
      //
    }
  };
  const onUpdate = async () => {
    if (newTweet === "") {
      alert("내용을 입력해 주세요.");
      return;
    }
    try {
      await updateDoc(doc(db, "tweets", id), { tweet: newTweet });
    } catch (error) {
      console.log(error);
    } finally {
      alert("업데이트 완료했어요.");
      setEditActive(false);
    }
  };
  return (
    <Wrapper>
      <Column>
        <Username>{username}</Username>
        {editActive ? (
          <EditInput
            required
            rows={5}
            maxLength={180}
            onChange={onChange}
            placeholder="what is happening"
            value={newTweet}
          />
        ) : (
          <Payload>{tweet}</Payload>
        )}

        {user?.uid === userId ? (
          <>
            {!editActive ? (
              <DeleteButton onClick={onDelete}>Delete</DeleteButton>
            ) : null}
            <ChangeButton onClick={onEdit}>
              {editActive ? "cancle" : "Edit"}
            </ChangeButton>
            {editActive ? (
              <UpdateButton onClick={onUpdate}>Update</UpdateButton>
            ) : null}
          </>
        ) : null}
      </Column>
      {photo ? (
        <Column>
          <Photo src={photo} />
        </Column>
      ) : null}
    </Wrapper>
  );
}
