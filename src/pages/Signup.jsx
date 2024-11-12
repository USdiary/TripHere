import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import Button from '../components/Btn';
import CommonModal from '../components/CommonModal';

const FormContainer = styled.form`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 865px;
    padding: 20px;
    margin: 0 auto;
    margin-top: 100px;
`;

const TitleLabel = styled.h2`
    margin-bottom: 80px;
    font-weight: bold;
    font-size: 36px;
    display: flex;
`;

const Asterisk = styled.div`
    color: red;
    margin-left: 4px;
`;

const InputContainer = styled.div`
    width: 100%;
    display: flex;
    margin-bottom: 15px;
    align-items: center;
    position: relative;
`;

const Label = styled.div`
    width: 185px;
    display: flex;
    align-items: center;
    font-size: 20px;
`;

const ErrorStyled = styled.div`
    width: 490px;
    margin-bottom: 20px;
`;

const ErrorMessage = styled.small`
    color: red;
    font-size: 16px;
`;

const InputField = styled.input`
    width: 448.3px;
    height: 65px;
    border: 1px solid #e0e0e0;
    border-radius: 10px;
    padding: 0 20px;
    font-size: 20px;
    outline: none;

    &:focus {
        border: 1px solid #59abe6;
        outline: none;
    }
`;

const BtnStyled = styled.div`
    margin-left: 20px;
`;

// 타이머 스타일
const TimerStyled = styled.div`
    position: absolute;
    right: 205px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 18px;
    color: red;
`;

const SignUp = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isCheckingId, setIsCheckingId] = useState(false);
  const [isCheckingPhone, setIsCheckingPhone] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [isEmailDisabled, setIsEmailDisabled] = useState(false);
  const [showCertificationInput, setShowCertificationInput] = useState(false);
  const [timer, setTimer] = useState(180);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isCertified, setIsCertified] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    trigger,
    watch,
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    alert('회원가입이 완료되었습니다!');
  };

  // 아이디 중복 확인 (로컬 처리)
  const handleIdCheck = () => {
    setIsCheckingId(true);
    const id = watch('id');
    if (id === 'existingUser') {
      setModalMessage('이미 사용 중인 아이디입니다.');
      setIsModalOpen(true);
    } else {
      setModalMessage('사용 가능한 아이디입니다.');
      setIsModalOpen(true);
    }
    setIsCheckingId(false);
  };

  // 전화번호 중복 확인 (로컬 처리)
  const handlePhoneCheck = () => {
    setIsCheckingPhone(true);
    const phone = watch('phone');
    if (phone === '123-456-7890') {
      setModalMessage('이미 사용 중인 전화번호입니다.');
      setIsModalOpen(true);
    } else {
      setModalMessage('사용 가능한 전화번호입니다.');
      setIsModalOpen(true);
    }
    setIsCheckingPhone(false);
  };

  // 이메일 인증 (로컬 처리)
  const handleEmailCheck = () => {
    setIsCheckingEmail(true);
    const email = watch('email');
    if (!email.includes('@')) {
      setModalMessage('올바른 이메일 주소를 입력해주세요.');
      setIsModalOpen(true);
    } else {
      setModalMessage('인증번호가 발송되었습니다.');
      setIsModalOpen(true);
      setShowCertificationInput(true);
      setIsEmailDisabled(true);
      startTimer();
    }
    setIsCheckingEmail(false);
  };

  // 인증번호 확인 (로컬 처리)
  const handleCertificationCheck = () => {
    const certCode = watch('certificationCode');
    if (certCode === '123456') {
      setIsCertified(true);
      setModalMessage('인증에 성공했습니다.');
      setIsModalOpen(true);
    } else {
      setIsCertified(false);
      setModalMessage('인증번호가 올바르지 않습니다.');
      setIsModalOpen(true);
    }
  };

  // 타이머 시작 (인증번호 발송 후)
  const startTimer = () => {
    setIsTimerRunning(true);
    let seconds = 180;
    const interval = setInterval(() => {
      seconds -= 1;
      setTimer(seconds);
      if (seconds <= 0) {
        clearInterval(interval);
        setIsTimerRunning(false);
        setModalMessage('인증 시간이 만료되었습니다.');
        setIsModalOpen(true);
      }
    }, 1000);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <FormContainer onSubmit={handleSubmit(onSubmit)}>
        <TitleLabel>
          회원가입
          <Asterisk>*</Asterisk>
        </TitleLabel>
        
        <InputContainer>
          <Label>아이디</Label>
          <InputField
            type="text"
            {...register('id', { required: '아이디를 입력하세요.' })}
          />
          <BtnStyled>
            <Button onClick={handleIdCheck} disabled={isCheckingId}>
              아이디 중복 확인
            </Button>
          </BtnStyled>
        </InputContainer>
        {errors.id && <ErrorStyled><ErrorMessage>{errors.id.message}</ErrorMessage></ErrorStyled>}
        
        <InputContainer>
          <Label>전화번호</Label>
          <InputField
            type="text"
            {...register('phone', { required: '전화번호를 입력하세요.' })}
          />
          <BtnStyled>
            <Button onClick={handlePhoneCheck} disabled={isCheckingPhone}>
              전화번호 중복 확인
            </Button>
          </BtnStyled>
        </InputContainer>
        {errors.phone && <ErrorStyled><ErrorMessage>{errors.phone.message}</ErrorMessage></ErrorStyled>}
        
        <InputContainer>
          <Label>이메일</Label>
          <InputField
            type="email"
            {...register('email', { required: '이메일을 입력하세요.' })}
          />
          <BtnStyled>
            <Button onClick={handleEmailCheck} disabled={isCheckingEmail}>
              이메일 인증
            </Button>
          </BtnStyled>
        </InputContainer>
        {errors.email && <ErrorStyled><ErrorMessage>{errors.email.message}</ErrorMessage></ErrorStyled>}

        {showCertificationInput && (
          <InputContainer>
            <Label>인증번호</Label>
            <InputField
              type="text"
              {...register('certificationCode', { required: '인증번호를 입력하세요.' })}
            />
            <BtnStyled>
              <Button onClick={handleCertificationCheck} disabled={isCertified}>
                인증번호 확인
              </Button>
            </BtnStyled>
          </InputContainer>
        )}

        <Button type="submit" disabled={isSubmitting}>
          회원가입
        </Button>

        {/* 타이머 표시 */}
        {isTimerRunning && <TimerStyled>{timer}초</TimerStyled>}
      </FormContainer>

      {/* 모달 */}
      {isModalOpen && (
        <CommonModal
          message={modalMessage}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default SignUp;
