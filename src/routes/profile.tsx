import styled from "styled-components";
import { auth, db, storage } from "../firebase";
import { useEffect, useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { ITweet } from "../components/timeline";
import Tweet from "../components/tweet";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 20px;
`;
const AvatarUpload = styled.label`
  width: 80px;
  height: 80px;
  overflow: hidden;
  border-radius: 50%;
  background-color: #1d9bf0;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    width: 60px;
  }
`;
const AvatarImg = styled.img`
  width: 100%;
`;
const AvaterInput = styled.input`
  display: none;
`;

const NameWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Name = styled.span`
  font-size: 22px;
`;

const NameInput = styled.input`
  background-color: transparent;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 6px;
  color: #fff;
  margin-bottom: 10px;
`;

const Tweets = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`;

const EditBtn = styled.button`
  border: none;
  background: none;
  cursor: pointer;
  span {
    font-size: 12px;
    color: #707070;
  }
`;

const CancleButton = styled.button`
  background-color: aliceblue;
  color: #000;
  font-weight: 600;
  border: 0;
  border-radius: 5px;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  cursor: pointer;
  margin-bottom: 12px;
`;

const UpdateButton = styled(CancleButton)`
  background-color: #00ff8c;
  margin-left: 10px;
`;
export default function Profile() {
  const user = auth.currentUser;
  const [avatar, setAvatar] = useState(user?.photoURL);
  const [tweets, setTweet] = useState<ITweet[]>([]);
  const [isEditName, setIsEditName] = useState(false);
  const [userName, setUserName] = useState(
    `${user?.displayName ?? "Anonymous"}`
  );
  const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (!user) return;
    if (files && files.length === 1) {
      const file = files[0];
      const locationRef = ref(storage, `avatars/${user?.uid}`);
      const result = await uploadBytes(locationRef, file);
      const avatarUrl = await getDownloadURL(result.ref);
      setAvatar(avatarUrl);
      await updateProfile(user, { photoURL: avatarUrl });
    }
  };

  const fetchTweets = async () => {
    const tweetQuery = query(
      collection(db, "tweets"),
      where("userId", "==", user?.uid),
      orderBy("createdAt", "desc"),
      limit(25)
    );
    const snapshot = await getDocs(tweetQuery);
    const tweets = snapshot.docs.map((doc) => {
      const { tweet, createdAt, userId, username, photo } = doc.data();
      return {
        tweet,
        username,
        userId,
        photo,
        createdAt,
        id: doc.id,
      };
    });
    setTweet(tweets);
  };

  //이름 변경하기 위한 버튼 및 변경 취소 이벤트
  const handleChangeName = () => {
    setIsEditName(!isEditName);
    setUserName(`${user?.displayName ?? "Anonymous"}`);
  };

  //변경할 이름 체인지 이벤트
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(e.target.value);
  };

  const onSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (user && user?.displayName !== userName) {
      await updateProfile(user, { displayName: userName });
      setIsEditName(false);
      alert("이름 변경을 완료했습니다.");
    }
  };

  useEffect(() => {
    fetchTweets();
  }, []);

  useEffect(() => {
    console.log("updated userName");
  }, [user?.displayName]);

  return (
    <Wrapper>
      <AvatarUpload htmlFor="avatar">
        {avatar ? (
          <AvatarImg src={avatar} />
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path d="M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.465 14.493a1.23 1.23 0 0 0 .41 1.412A9.957 9.957 0 0 0 10 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 0 0-13.074.003Z" />
          </svg>
        )}
      </AvatarUpload>
      <AvaterInput
        onChange={onAvatarChange}
        id="avatar"
        type="file"
        accept="image/*"
      />
      {isEditName ? (
        <form onSubmit={onSubmit}>
          <NameInput
            required
            placeholder="user name"
            value={userName}
            onChange={onChange}
          />
          <div>
            <CancleButton type="button" onClick={handleChangeName}>
              CALCLE
            </CancleButton>
            <UpdateButton type="submit">UPDATE</UpdateButton>
          </div>
        </form>
      ) : (
        <NameWrap>
          <Name>{user?.displayName ?? "Anonymous"}</Name>
          <EditBtn type="button" onClick={handleChangeName}>
            <span>이름 변경</span>
          </EditBtn>
        </NameWrap>
      )}
      <Tweets>
        {tweets.map((tweet) => (
          <Tweet key={tweet.id} {...tweet} />
        ))}
      </Tweets>
    </Wrapper>
  );
}
