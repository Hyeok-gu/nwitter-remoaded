import styled from "styled-components";

export default function PostTweetForm() {
  const Form = styled.form``;
  const TextArea = styled.textarea``;
  const AttachFileButton = styled.label`
    cursor: pointer;
  `;
  const AttachFileInput = styled.input`
    display: none;
  `;
  const SubmitBtn = styled.input``;

  return (
    <Form>
      <TextArea placeholder="what is happening" />
      <AttachFileButton htmlFor="file">Add Photo</AttachFileButton>
      <AttachFileInput type="file" id="file" accept="image/*" />
      <SubmitBtn />
    </Form>
  );
}
