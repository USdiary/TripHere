import React, { useState, useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../components/Btn';
import CommonModal from '../components/CommonModal';
import {
    checkIdDuplicate,
    checkPhoneDuplicate,
    checkEmailDuplicate,
    verifyCertificationCode,
    signUp,
} from '../api/Signup/SignUpApi';

const FormContainer = styled.form`
    display: flex;
    flex-direction: column; /* 세로 방향으로 요소 배치 */
    align-items: center; /* 중앙 정렬 */
    width: 865px; /* 폼의 최대 너비 */
    padding: 20px; /* 여백 추가 */
    margin: 0 auto; /* 중앙 정렬을 위한 여백 */
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
    position: relative; /* 타이머 위치를 위한 상대 위치 */
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
    color: red; /* 에러 메시지 색상 */
    font-size: 16px; /* 에러 메시지 글자 크기 */
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
        outline: none; /* 기본 포커스 아웃라인 제거 */
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

function SignUp() {
    const {
        register,
        handleSubmit,
        watch, // watch 추가
        trigger,
        getValues, // getValues를 추가로 가져옴
        formState: { isSubmitting, errors },
        control,
    } = useForm();

    const navigate = useNavigate();
    const [isIdChecked, setIsIdChecked] = useState(false);
    const [isPhoneChecked, setIsPhoneChecked] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [isCheckingId, setIsCheckingId] = useState(false);
    const [isCheckingEmail, setIsCheckingEmail] = useState(false);

    const [isCheckingPhone, setIsCheckingPhone] = useState(false);
    const [isEmailDisabled, setIsEmailDisabled] = useState(false);

    const [timer, setTimer] = useState(180);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [showCertificationInput, setShowCertificationInput] = useState(false);
    const [isCertified, setIsCertified] = useState(false);

    const closeModal = () => {
        setIsModalOpen(false);
        document.body.removeAttribute('inert');
    };

    //아이디 체크 여부
    const handleIdCheck = async (event) => {
        event.preventDefault();
        const userIdValue = watch('userId');

        const isUserIdValid = await trigger('userId');

        if (!isUserIdValid || !userIdValue) {
            return;
        }

        setIsCheckingId(true);

        try {
            const { status, message, checkedId } = await checkIdDuplicate(
                userIdValue
            );

            // 응답 데이터 및 상태 코드 출력
            console.log('ID 중복 확인 요청 : %s', userIdValue);
            const requestBody = { userId: userIdValue };
            console.log('요청 본문:', requestBody);
            console.log('ID 중복 확인 응답 상태 코드:', status);

            if (status === 200) {
                // 성공적인 응답
                setModalMessage(message || '사용할 수 있는 아이디입니다.');
                setIsIdChecked(true); // 아이디 중복 체크 성공 시 상태 업데이트
                console.log('사용 가능한 아이디:', checkedId); // 사용 가능한 아이디 출력
            } else if (status === 409) {
                // 중복된 아이디일 경우
                setModalMessage(message || '이미 사용 중인 아이디입니다.');
                setIsIdChecked(false);
                console.log('중복된 아이디:', checkedId); // 중복된 아이디 출력
            } else {
                setModalMessage('아이디 확인 중 문제가 발생했습니다.');
            }
        } catch (error) {
            console.error('Error occurred during ID check:', error);
            setModalMessage(
                '아이디 확인 중 오류가 발생했습니다. 다시 시도해주세요.'
            );
        }

        setIsModalOpen(true);
        setIsCheckingId(false);
    };

    // userId 값이 변경될 때마다 중복 확인 상태 초기화
    const userIdValue = useWatch({ control, name: 'userId' }); // useWatch 사용

    useEffect(() => {
        if (userIdValue) {
            setIsIdChecked(false); // 값이 변경되면 중복 확인 상태 초기화
        }
    }, [userIdValue]);

    //전화번호 체크 여부
    const handlePhoneCheck = async (event) => {
        event.preventDefault();
        const phoneValue = watch('phone');

        const isPhoneValid = await trigger('phone');

        if (!isPhoneValid || !phoneValue) {
            return;
        }

        setIsCheckingPhone(true);

        try {
            const { status, message, checkedPhone } = await checkPhoneDuplicate(
                phoneValue
            );
            console.log('전화번호 중복 확인 요청: %s', phoneValue);
            const requestBody = { phonenumber: phoneValue };
            console.log('요청 본문:', requestBody);
            console.log('phone 중복 확인 응답 상태 코드:', status);

            if (status === 200) {
                setModalMessage(message || '사용할 수 있는 전화번호입니다.');
                setIsPhoneChecked(true);
                console.log('사용 가능한 전화번호:', phoneValue);
            } else if (status === 409) {
                setModalMessage(message || '이미 사용 중인 전화번호입니다.');
                setIsPhoneChecked(false);
                console.log('중복된 전화번호:', phoneValue);
            } else {
                setModalMessage('전화번호 중복 확인 중 오류가 발생했습니다.');
            }
        } catch (error) {
            console.error('전화번호 확인 중 오류 발생:', error);
            setModalMessage('서버와의 연결에 문제가 발생했습니다.');
        }
        setIsModalOpen(true);
        setIsCheckingPhone(false);
    };

    // 이메일 체크 및 인증번호 요청 함수
    const handleEmailCheck = async () => {
        const emailValue = watch('email'); // 이메일 가져오기
        const nameValue = watch('userName'); // 이름 가져오기

        // 이메일과 이름 필드의 유효성 검사만 실행
        const isEmailValid = await trigger('email');
        const isNameValid = await trigger('userName');

        if (!isEmailValid || !emailValue || !isNameValid || !nameValue) {
            setModalMessage('올바른 이메일과 이름을 입력해주세요.');
            setIsModalOpen(true);
            return;
        }

        setIsCheckingEmail(true);

        try {
            console.log('이메일 중복 확인 요청:', emailValue, nameValue);
            const { status, data } = await checkEmailDuplicate(
                emailValue,
                nameValue
            );

            if (status === 200) {
                setModalMessage(
                    data.message ||
                        '이메일로 인증번호를 전송했습니다. 이메일을 확인해주세요.'
                );
                setIsEmailDisabled(true); // 이메일 필드 비활성화
                setTimer(180); // 타이머 초기화
                setIsTimerRunning(true); // 타이머 시작
                setShowCertificationInput(true); // 인증번호 필드 표시
            } else if (status === 409) {
                setModalMessage('기존에 회원가입한 이메일입니다.');
            }
        } catch (error) {
            setModalMessage(
                '서버와 연결할 수 없습니다. 나중에 다시 시도해주세요.'
            );
        } finally {
            setIsModalOpen(true);
            setIsCheckingEmail(false);
        }
    };

    const handleCertificationCheck = async () => {
        const emailValue = getValues('email'); // 이메일 가져오기
        const certificationCode = getValues('certificationNum'); // 인증번호 가져오기

        if (!certificationCode || !emailValue) {
            setModalMessage('인증번호와 이메일을 확인해주세요.');
            setIsModalOpen(true);
            return;
        }

        try {
            console.log('인증번호 확인 요청 데이터:', {
                email: emailValue,
                code: certificationCode,
            });
            const { status, data } = await verifyCertificationCode(
                emailValue,
                certificationCode
            );

            if (status === 200 && data?.success) {
                setModalMessage('인증 성공 하였습니다.');
                setIsCertified(true); // 인증 성공 상태 업데이트
                setTimer(0); // 타이머 초기화
                setIsTimerRunning(false); // 타이머 중지
                setShowCertificationInput(false); // 인증번호 숨김
            } else {
                setModalMessage(
                    data?.message || '인증에 실패했습니다. 다시 시도해주세요.'
                );
            }
        } catch (error) {
            console.error('인증번호 확인 오류:', error);
            setModalMessage('인증에 실패했습니다. 서버를 확인해주세요.');
        } finally {
            setIsModalOpen(true);
        }
    };

    //타이머 로직
    const resetCertificationState = () => {
        setTimer(180); // 타이머 초기화
        setIsTimerRunning(false); // 타이머 중지
        setShowCertificationInput(false); // 인증번호 필드 숨김
        setIsEmailDisabled(false); // 이메일 입력 활성화
    };

    useEffect(() => {
        if (!isCertified) {
            resetCertificationState();
        }
    }, [watch('email')]);

    useEffect(() => {
        if (isCertified) {
            resetCertificationState(); // 인증 성공 시에도 초기화
        }
    }, [isCertified]);

    useEffect(() => {
        if (isTimerRunning && timer > 0) {
            const interval = setInterval(() => {
                setTimer((prevTime) => prevTime - 1);
            }, 1000);

            return () => clearInterval(interval); // 클린업
        }

        if (timer === 0 && isTimerRunning) {
            setModalMessage('인증 시간이 만료되었습니다. 다시 시도해주세요.');
            setIsModalOpen(true);
            setIsTimerRunning(false); // 중복 실행 방지
        }
    }, [timer, isTimerRunning]);

    //회원가입 처리
    const onSubmit = async (data) => {
        const {
            userId,
            password,
            passwordCheck,
            userName,
            phone,
            email,
            nickname,
            birth,
        } = data;
        // 공백 제거 및 일치 여부 확인
        const trimmedPassword =
            typeof password === 'string' ? password.trim() : '';
        const trimmedPasswordCheck =
            typeof passwordCheck === 'string' ? passwordCheck.trim() : '';

        if (trimmedPassword !== trimmedPasswordCheck) {
            setModalMessage('비밀번호가 일치하지 않습니다.');
            setIsModalOpen(true);
            return;
        }

        const formattedPhone = phone.replace(/\D/g, ''); // 숫자만 추출

        const userData = {
            id: userId,
            password: trimmedPassword,
            passwordCheck: trimmedPasswordCheck,
            name: userName,
            phonenumber: formattedPhone,
            email: email,
            nickname: nickname,
            birth: birth,
        };

        // 요청 데이터 확인용 로그
        console.log('회원가입 요청 데이터:', userData);
        console.log(
            '데이터 타입 확인:',
            Object.keys(userData).reduce((acc, key) => {
                acc[key] = typeof userData[key];
                return acc;
            }, {})
        );

        try {
            const { status, data } = await signUp(userData);
            if (status === 200) {
                console.log('회원가입 성공:', data.message);
                setModalMessage('회원가입이 완료되었습니다.');
                setIsModalOpen(true);
                setTimeout(() => {
                    window.location.replace('/login');
                }, 1500); // 회원가입 성공 시 1.5초 딜에이 후 로그인 페이지로 이동
            } else if (status === 409) {
                console.log('이미 회원가입 된 정보', data.message);
                setModalMessage('이미 존재하는 회원정보 입니다.');
                setIsModalOpen(true);
            } else {
                throw new Error(data.message || '회원가입에 실패했습니다.');
            }
        } catch (error) {
            console.error('회원가입 오류:', error.message);

            if (error.message.includes('NetworkError')) {
                setModalMessage(
                    '네트워크 연결이 원활하지 않습니다. 다시 시도해주세요.'
                );
            } else {
                setModalMessage(
                    error.message || '알 수 없는 오류가 발생했습니다.'
                );
            }

            setIsModalOpen(true);
        }
    };

    //생년월일 유효성 설정
    const today = new Date().toISOString().split('T')[0]; // 오늘 날짜
    const minBirthDate = '1900-01-01'; // 최소 생년월일

    return (
        <FormContainer noValidate onSubmit={handleSubmit(onSubmit)}>
            <TitleLabel>회원가입</TitleLabel>
            {/*아이디 */}
            <InputContainer>
                <Label>
                    아이디<Asterisk>*</Asterisk>
                </Label>

                <InputField
                    id="userId"
                    type="text"
                    placeholder="아이디"
                    {...register('userId', {
                        required: '아이디는 필수 입력입니다.',
                        minLength: {
                            value: 6,
                            message:
                                '6자 이상 16자 이하의 영문 혹은 숫자를 조합해주세요.',
                        },
                        maxLength: {
                            value: 16,
                            message:
                                '6자 이상 16자 이하의 영문 혹은 숫자를 조합해주세요.',
                        },
                    })}
                    onChange={(e) => {
                        setIsIdChecked(false); // 아이디가 변경될 때 중복 확인 초기화
                        register('userId').onChange(e);
                        trigger('userId'); // 유효성 검사 트리거
                    }}
                    aria-invalid={errors.userId ? 'true' : 'false'}
                />
                <BtnStyled>
                    <Button
                        width="170px"
                        height="65px"
                        borderRadius="10px"
                        fontSize="20px"
                        text="중복확인"
                        type="button" // 버튼 타입을 submit에서 button으로 변경
                        onClick={handleIdCheck} // 중복 확인 버튼 클릭 시 호출
                        disabled={
                            isCheckingId ||
                            isIdChecked ||
                            !!errors.userId ||
                            !watch('userId')
                        }
                    />
                </BtnStyled>
            </InputContainer>
            <ErrorStyled>
                {errors.userId && (
                    <ErrorMessage>{errors.userId.message}</ErrorMessage>
                )}
            </ErrorStyled>

            <InputContainer>
                <Label>
                    비밀번호<Asterisk>*</Asterisk>
                </Label>
                <InputField
                    id="password"
                    type="password"
                    placeholder="*********"
                    {...register('password', {
                        required: '비밀번호는 필수 입력입니다.',
                        minLength: {
                            value: 10,
                            message: '최소 10자 이상 입력해주세요.',
                        },
                        validate: {
                            containsSpecialChar: (value) =>
                                /(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>?~-])/.test(
                                    value
                                ) || '특수 문자가 포함되어야 합니다.',
                            containsNumber: (value) =>
                                /(?=.*\d)/.test(value) ||
                                '숫자가 포함되어야 합니다.',
                            containsLetter: (value) =>
                                /(?=.*[a-zA-Z])/.test(value) ||
                                '영문자가 포함되어야 합니다.',
                        },
                    })}
                    onChange={(e) => {
                        register('password').onChange(e);
                        trigger('password'); // 유효성 검사 트리거
                    }}
                    aria-invalid={errors.password ? 'true' : 'false'}
                />
            </InputContainer>
            <ErrorStyled>
                {errors.password && (
                    <ErrorMessage>{errors.password.message}</ErrorMessage>
                )}
            </ErrorStyled>

            <InputContainer>
                <Label>
                    비밀번호 확인<Asterisk>*</Asterisk>
                </Label>
                <InputField
                    id="passwordCheck"
                    type="password"
                    placeholder="비밀번호 확인"
                    {...register('passwordCheck', {
                        required: '동일한 비밀번호를 입력해주세요.',
                        validate: {
                            matchesPreviousPassword: (value) =>
                                value === watch('password') ||
                                '비밀번호가 일치하지 않습니다.',
                        },
                    })}
                    onChange={(e) => {
                        register('passwordCheck').onChange(e);
                        trigger('passwordCheck'); // 유효성 검사 트리거
                    }}
                    aria-invalid={errors.passwordCheck ? 'true' : 'false'}
                />
            </InputContainer>
            <ErrorStyled>
                {errors.passwordCheck && (
                    <ErrorMessage>{errors.passwordCheck.message}</ErrorMessage>
                )}
            </ErrorStyled>
            {/* 이름 */}
            <InputContainer>
                <Label>
                    이름<Asterisk>*</Asterisk>
                </Label>

                <InputField
                    id="userName"
                    type="text"
                    placeholder="이름"
                    {...register('userName', {
                        required: '이름은 필수 입력입니다.',
                    })}
                    onChange={(e) => {
                        register('userName').onChange(e);
                        trigger('userName'); // 유효성 검사 트리거
                    }}
                    aria-invalid={errors.userName ? 'true' : 'false'}
                    disabled={isCertified}
                />
            </InputContainer>
            <ErrorStyled>
                {errors.userName && (
                    <ErrorMessage>{errors.userName.message}</ErrorMessage>
                )}
            </ErrorStyled>

            {/* 전화번호 */}
            <InputContainer>
                <Label>
                    전화번호<Asterisk>*</Asterisk>
                </Label>

                <InputField
                    id="phone"
                    type="tel"
                    placeholder="숫자만 입력해주세요."
                    {...register('phone', {
                        required: '숫자만 입력해주세요.',
                        pattern: {
                            value: /^01(?:0|1|[6-9])(?:\d{3}|\d{4})\d{4}$/,
                            message: '010-1234-5678 형식으로 입력해주세요.',
                        },
                    })}
                    onInput={(e) => {
                        // 숫자 외의 문자를 제거
                        e.target.value = e.target.value.replace(/[^0-9]/g, '');
                    }}
                    onChange={(e) => {
                        // 값 변경 시 유효성 검사 트리거하지 않도록 수정
                        register('phone').onChange(e);
                        trigger('phone');
                    }}
                    aria-invalid={errors.phone ? 'true' : 'false'}
                />
                <BtnStyled>
                    <Button
                        width="170px"
                        height="65px"
                        borderRadius="10px"
                        fontSize="20px"
                        text="중복확인"
                        type="button" // 버튼 타입을 submit에서 button으로 변경
                        onClick={handlePhoneCheck}
                        disabled={
                            isCheckingPhone ||
                            isPhoneChecked ||
                            !!errors.phone ||
                            !watch('phone')
                        }
                    />
                </BtnStyled>
            </InputContainer>
            <ErrorStyled>
                {errors.phone && (
                    <ErrorMessage>{errors.phone.message}</ErrorMessage>
                )}
            </ErrorStyled>

            {/* 이메일 */}
            <InputContainer>
                <Label>
                    이메일<Asterisk>*</Asterisk>
                </Label>

                <InputField
                    id="email"
                    type="email"
                    placeholder="ex) yeogida@travel.com"
                    {...register('email', {
                        required: '이메일은 필수 입력입니다.',
                        pattern: {
                            value: /\S+@\S+\.\S+/,
                            message: '이메일 형식이 맞지 않습니다',
                        },
                    })}
                    onChange={(e) => {
                        register('email').onChange(e);
                        trigger('email'); // 유효성 검사 트리거
                    }}
                    aria-invalid={errors.email ? 'true' : 'false'}
                    disabled={isCertified}
                />
                <BtnStyled>
                    <Button
                        width="170px"
                        height="65px"
                        borderRadius="10px"
                        fontSize="20px"
                        text="인증번호 받기"
                        type="button" // 버튼 타입을 submit에서 button으로 변경
                        onClick={handleEmailCheck}
                        disabled={
                            isEmailDisabled ||
                            !!errors.email ||
                            !!errors.userName ||
                            !watch('email') ||
                            !watch('userName') ||
                            isCertified
                        }
                    />
                </BtnStyled>
            </InputContainer>

            <ErrorStyled>
                {errors.email && (
                    <ErrorMessage>{errors.email.message}</ErrorMessage>
                )}
            </ErrorStyled>
            {/* 인증번호 */}
            {showCertificationInput && !isCertified && (
                <InputContainer>
                    <Label></Label>

                    <InputField
                        id="certificationNum"
                        type="text"
                        placeholder="인증번호 6자리를 입력해주세요."
                        {...register('certificationNum', {
                            required: '인증번호를 입력해주세요.',
                            maxLength: {
                                value: 6,
                                message: '6자리 인증번호를 입력해주세요.',
                            },
                            validate: {
                                isNumber: (value) =>
                                    /^[0-9]+$/.test(value) ||
                                    '숫자만 입력 가능합니다.',
                            },
                        })}
                        onChange={(e) => {
                            // 항상 문자열로 처리
                            e.target.value = e.target.value.replace(
                                /[^0-9]/g,
                                ''
                            ); // 숫자만 허용
                            register('certificationNum').onChange(e); // React Hook Form에 업데이트
                            trigger('certificationNum'); // 유효성 검사 트리거
                        }}
                        disabled={isCertified} // 인증 성공 시 비활성화
                    />
                    <BtnStyled>
                        <Button
                            width="170px"
                            height="65px"
                            borderRadius="10px"
                            fontSize="20px"
                            text="인증번호 확인"
                            type="button"
                            onClick={handleCertificationCheck} // 매개변수 없이 함수 호출
                            disabled={!watch('certificationNum') || isCertified} // 인증번호가 없으면 비활성화
                        />
                    </BtnStyled>
                    {/* 타이머가 작동 중일 때만 타이머 표시 */}
                    {isTimerRunning && (
                        <TimerStyled>
                            {Math.floor(timer / 60)}:{timer % 60}
                        </TimerStyled>
                    )}
                </InputContainer>
            )}

            {/* 닉네임 */}
            <InputContainer>
                <Label>
                    닉네임<Asterisk>*</Asterisk>
                </Label>

                <InputField
                    id="nickname"
                    type="text"
                    placeholder="닉네임"
                    {...register('nickname', {
                        required: '닉네임은 필수 입력입니다.',
                    })}
                    onChange={(e) => {
                        register('nickname').onChange(e);
                        trigger('nickname'); // 유효성 검사 트리거
                    }}
                    aria-invalid={errors.nickname ? 'true' : 'false'}
                />
            </InputContainer>
            <ErrorStyled>
                {errors.nickname && (
                    <ErrorMessage>{errors.nickname.message}</ErrorMessage>
                )}
            </ErrorStyled>

            {/* 생년월일 */}
            <InputContainer>
                <Label>
                    생년월일<Asterisk>*</Asterisk>
                </Label>

                <InputField
                    id="birth"
                    type="date"
                    placeholder="생년월일"
                    {...register('birth', {
                        required: '생년월일은 필수 입력입니다.',
                        pattern: {
                            value: /^\d{4}-\d{2}-\d{2}$/,
                            message: '유효한 생년월일을 입력해주세요.',
                        },
                        validate: {
                            inValidRange: (value) =>
                                (value >= minBirthDate && value <= today) ||
                                '1900-01-01 ~ 오늘 날짜 사이여야 합니다.',
                        },
                    })}
                    onChange={(e) => {
                        register('birth').onChange(e);
                        trigger('birth'); // 유효성 검사 트리거
                    }}
                    aria-invalid={errors.birth ? 'true' : 'false'}
                />
            </InputContainer>
            <ErrorStyled>
                {errors.birth && (
                    <ErrorMessage>{errors.birth.message}</ErrorMessage>
                )}
            </ErrorStyled>

            <Button
                width="490px"
                height="80px"
                borderRadius="10px"
                fontSize="26px"
                text="회원가입"
                type="submit"
                disabled={isSubmitting}
            />

            {/* Modal for alerts */}
            <CommonModal
                isOpen={isModalOpen}
                onRequestClose={closeModal} // Changed from onClose to onRequestClose
                title={modalMessage}
            />
        </FormContainer>
    );
}

export default SignUp;
