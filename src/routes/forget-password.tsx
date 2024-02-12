import { useState } from "react";
import { auth } from "../firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { Input, Title, Wrapper } from "../components/auth-components";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const InputWrap = styled.div`
  width: 100%;
  input {
    margin-top: 20px;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 10px 20px;
  border: none;
  border-radius: 50px;
  color: #000;
  background: #fff;
  font-weight: 500;
  margin-top: 20px;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
`;

export default function ForGetPassword() {
  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e;
    if (name === "email") {
      setEmail(value);
    }
  };
  const SendEmail = () => {
    if (email === "") {
      alert("이메일을 입력하세요");
      return;
    }
    sendPasswordResetEmail(auth, email);
    try {
      alert("비밀번호 변경 메일이 정상적으로 발송되었습니다.");
    } catch (error) {
      console.error(error);
    }

    navigate("/");
  };

  return (
    <Wrapper>
      <Title>Forget Password 🍤</Title>
      <InputWrap>
        <Input
          name="email"
          value={email}
          placeholder="비밀번호 변경할 이메일 입력"
          onChange={onChange}
        />{" "}
      </InputWrap>
      <Button onClick={SendEmail}>비밀번호 변경</Button>
    </Wrapper>
  );
}
