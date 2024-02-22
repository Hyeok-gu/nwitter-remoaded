import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { db } from "../firebase";
import Tweet from "./tweet";

export interface ITweet {
  id: string;
  photo?: string;
  tweet: string;
  userId: string;
  username: string;
  createdAt: number;
}

const Wrapper = styled.div``;

export default function Timeline() {
  const [tweets, setTweet] = useState<ITweet[]>([]);
  const fetchTweets = async () => {
    const tweetsQuery = query(
      collection(db, "tweets"),
      orderBy("createdAt", "desc")
    );

    await onSnapshot(tweetsQuery, (snapshot) => {
      //tweetsQuery 이벤트 리스너 역할, 데이터에 이벤트가 발생 시 아래 리스트를 보면서 필요한 데이터를 추출
      const tweets = snapshot.docs.map((doc) => {
        const { tweet, username, userId, photo, createdAt } = doc.data();
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
    });
  };

  useEffect(() => {
    fetchTweets();
  });

  return (
    <Wrapper>
      {tweets.map((tweet) => (
        <Tweet key={tweet.id} {...tweet} />
      ))}
    </Wrapper>
  );
}
