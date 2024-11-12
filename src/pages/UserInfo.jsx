import styled from 'styled-components';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Btn from '../components/Btn';
import Modal from '../components/CommonModal';
// import EditInfoInput from '../components/EditInfoInput';
import defaultProfileImg from './img/card_img.png';
import { useNavigate } from 'react-router-dom';

const HeaderStyle = styled.div`
    margin-top: 150px;
    margin-bottom: 172px;
    // margin-bottom: 100px;
    font-weight: bold;
    font-size: 40px;
    display: flex;
    justify-content: center;
`;

const ArticleStyle = styled.div `
    margin-bottom: 274px;
`;

const BeforeCheckStyle = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`;

const MyProfile = styled.div`
    width: 214px;
    height: 274px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;

const MyProfileName = styled.div`
    margin-top: 33px;
    font-size: 28px;
    display: flex;
    justify-content: center;
    line-height: 1;
`;

const CheckPassword = styled.div`
    margin-left: 66px;
    // height: 222px;
    display: flex;
    flex-direction: column;
`;

const CheckPasswordText = styled.div`
    font-size: 24px;
    margin-bottom: 20px;
`;

const AfterCheckStyle = styled.div `
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const StyledContainer = styled.div `
    width: 920px;
    margin-bottom: 50px;
`;

const StyledTitle = styled.div `
    font-weight: bold;
    font-size: 24px;
    margin-bottom: 15px;
`;

const StyledContent = styled.div `
    border: 2px solid #e0e0e0;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 25px 0;
    font-size: 18px;
`;

const Line = styled.div`
    position: relative;
    width: 920px;
    height: 2px;
    background-color: #e0e0e0;
    margin-top: 200px;
    margin-bottom: 50px;

    &:before,
    &:after {
        content: '';
        position: absolute;
        top: 50%;
        transform: translateY(-50%) rotate(45deg);
        width: 10px;
        height: 10px;
        background-color: #e0e0e0;
    }

    &:before {
        left: -10px;
    }

    &:after {
        right: -10px;
    }
`;

const MyProfileImage = styled.img`
    width: 213px;
    height: 213px;
    border-radius: 180px;
    object-fit: cover;
`;

const ButtonContainer = styled.div`
    display: flex;
    justify-content: space-between;
    gap: 16px;
    margin-top: 30px;
`;

const InputContainer = styled.div`
    width: 100%;
    display: flex;
    margin-bottom: 15px;
    margin-top: 20px;
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
    margin: 0 auto;
`;

const ErrorMessage = styled.div`
    color: red; /* 에러 메시지 색상 */
    font-size: 16px; /* 에러 메시지 글자 크기 */
    margin-top: -16px;
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
    }
`;

const BtnStyled = styled.div`
    margin-left: 20px;
`;

const TimerStyled = styled.div`
    position: absolute;
    right: 205px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 18px;
    color: #555;
`;

// ----------비밀번호 확인 전 Component----------
function BeforeCheck ({ btnClick, userData }) {
    const { register, handleSubmit, formState: { errors }, setError } = useForm();
    const [myPassword, setMyPassword] = useState("");
    const [profileImg, setProfileImg] = useState("");
    const [nickname, setNickname] = useState("");

    useEffect(() => {
        // userInfo가 설정된 이후에만 상태 업데이트
        if (userData) {
            setMyPassword(userData.password);
            setProfileImg(userData.profilephoto);
            setNickname(userData.nickname);
        }
    }, [userData]);

    const handleCheck = (data) => {
        if (data.passwordConfirm === myPassword) {
            btnClick(true); // 비밀번호가 맞으면 개인정보 수정 컴포넌트로 이동
        } else {
            setError('passwordConfirm', {
                type: 'manual',
                message: '잘못된 비밀번호를 입력했습니다.',
            });
        }
    };

    return (
        <BeforeCheckStyle>
            {/* 프로필 */}
            <MyProfile>
                <MyProfileImage src={profileImg} />
                <MyProfileName>{nickname}</MyProfileName>
            </MyProfile>

            {/* 비밀번호 입력란 */}
            <CheckPassword>
                <CheckPasswordText>비밀번호 확인</CheckPasswordText>
                
                {/* 입력칸 */}
                <InputField
                    id="PasswordConfirm"
                    type="password"
                    placeholder="비밀번호 확인"
                    {...register('passwordConfirm', {
                        required: '비밀번호를 입력해주세요.',
                    })}
                    aria-invalid={errors.passwordConfirm ? 'true' : 'false'}
                />

                {/* 에러 메시지 */}
                <div style={{ height: '20px' }}>
                    {errors.passwordConfirm && (
                        <div style={{ color: 'red', marginTop: '15px' }}>
                            {errors.passwordConfirm.message}
                        </div>
                    )}
                </div>

                {/* 버튼 */}
                <Btn 
                    text='확인'
                    style={{marginLeft: 'auto', marginTop: '60px'}}
                    onClick={handleSubmit(handleCheck)}
                />
            </CheckPassword>
        </BeforeCheckStyle>
    );
}

/* 프로필 사진 컴포넌트 */
function ProfileImage({ userInfo }) {
    const [profileImg, setProfileImg] = useState(userInfo?.profilephoto || '');  // 초기값 설정
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    // userInfo 변경 시 profileImg 업데이트
    useEffect(() => {
        setProfileImg(userInfo?.profilephoto || '');  // userInfo 변경되면 프로필 이미지 업데이트
    }, [userInfo]);

    // 사진 파일 선택 함수
    const handleChangeImage = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {  // 이미지 파일인지 확인
            const reader = new FileReader();
            reader.onload = () => {
                setProfileImg(reader.result);  // 프로필 이미지 상태 업데이트
            };
            reader.readAsDataURL(file);  // 이미지를 base64로 변환하여 미리보기 표시
        }
    };

    // 기본 이미지 설정 함수
    const handleSetDefaultImage = () => {
        setProfileImg(defaultProfileImg);
    };

    // 파일 입력 클릭을 트리거하는 함수
    const triggerFileInput = () => {
        document.getElementById("fileInput").click();  // 숨겨진 파일 input 클릭 트리거
    };

    // 모달 닫기 함수
    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <StyledContainer>
            <StyledTitle>프로필 사진</StyledTitle>
            <StyledContent>
                {/* 프로필 이미지 클릭 시 파일 선택 창 열기 */}
                <MyProfileImage
                    src={profileImg}
                    alt="Profile Image"
                />

                {/* 파일 선택 input 및 버튼 */}
                <ButtonContainer>
                    <input
                        id="fileInput"
                        type="file"
                        style={{ display: 'none' }}  // 파일 input 숨김
                        accept="image/*"  // 이미지 파일만 선택 가능하도록 제한
                        onChange={handleChangeImage}
                    />
                    <Btn
                        width='140px'
                        height='41px'
                        borderColor='#59abe6'
                        backgroundColor='#fff'
                        color='#59abe6'
                        text='기본 이미지'
                        onClick={handleSetDefaultImage}
                    />
                    <Btn
                        width='140px'
                        height='41px'
                        fontWeight='bold'
                        text='불러오기'
                        onClick={triggerFileInput}  // 불러오기 클릭 시 파일 선택 창 열기
                    />
                </ButtonContainer>
            </StyledContent>

            {/* Modal */}
            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal} // Changed from onClose to onRequestClose
                title={modalMessage}
            />
        </StyledContainer>
    );
}

/* 개인정보 수정 컴포넌트 */
function EditInfo ({ userInfo, setUserInfo, password, setPassword, passwordConfirm, setPasswordConfirm }) {
    const {
        register,
        handleSubmit,
        watch, // watch 추가
        setValue, // setValue를 사용하여 동적으로 값을 설정
        trigger,
        setError,
        clearErrors,
        formState: { errors },
    } = useForm();
    const [isEmailDisabled, setIsEmailDisabled] = useState(false);
    const [isCheckingEmail, setIsCheckingEmail] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [timer, setTimer] = useState(180);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [showCertificationInput, setShowCertificationInput] = useState(false);
    const [isCertified, setIsCertified] = useState(false);

    // 이메일과 닉네임 필드를 초기화
    useEffect(() => {
        if (userInfo?.email) {
            setValue('email', userInfo.email);
        }
        if (userInfo?.nickname) {
            setValue('nickname', userInfo.nickname);
        }
    }, [userInfo, setValue]);

    const watchPassword = watch('password', password);
    const watchPasswordConfirm = watch('passwordConfirm', passwordConfirm);

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);

        // 비어 있을 때 에러 제거
        if (value === '') {
            clearErrors('password');
        } else {
            if (value.length < 10) {
                setError('password', { message: '최소 10자 이상 입력해주세요.' });
            } else if (!/(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>?~-])/.test(value)) {
                setError('password', { message: '특수 문자가 포함되어야 합니다.' });
            } else if (!/(?=.*\d)/.test(value)) {
                setError('password', { message: '숫자가 포함되어야 합니다.' });
            } else if (!/(?=.*[a-zA-Z])/.test(value)) {
                setError('password', { message: '영문자가 포함되어야 합니다.' });
            } else {
                clearErrors('password'); // 조건을 모두 만족할 경우 에러 제거
            }
        }
    };

    const handlePasswordConfirmChange = (e) => {
        const value = e.target.value;
        setPasswordConfirm(value);

        // 비어 있을 때 에러 제거
        if (value === '') {
            clearErrors('passwordConfirm');
        } else {
            if (value !== watchPassword) {
                setError('passwordConfirm', { message: '비밀번호가 일치하지 않습니다.' });
            } else {
                clearErrors('passwordConfirm'); // 일치할 경우 에러 제거
            }
        }
    };

    // 이메일 체크 및 인증번호 요청 함수
    const handleEmailCheck = async (event) => {
        event.preventDefault();
        const emailValue = watch('email');
        const isEmailValid = await trigger('email');

        if (!isEmailValid || !emailValue) {
            return;
        }

        setIsCheckingEmail(true);

        // 이메일 중복 체크
        const isDuplicate = await checkEmailDuplicate(emailValue);

        if (isDuplicate) {
            setModalMessage('이미 사용 중인 이메일입니다.');
            setIsModalOpen(true); // 모달을 띄움
            setIsCheckingEmail(false);
            return; // 중복이면 인증번호 절차로 넘어가지 않도록 함
        } else {
            // 중복이 아니면 이메일 인증번호 전송 절차로 넘어감
            setModalMessage(
                '해당 이메일로 인증번호를 전송했습니다. 이메일을 확인해주세요.'
            );
            setIsEmailDisabled(true);
            setTimer(180);
            setIsTimerRunning(true);
            setShowCertificationInput(true); // 인증번호 입력 필드 표시
            setIsModalOpen(true); // 모달을 띄움
        }

        setIsCheckingEmail(false);
    };

    // 타이머가 작동하는 동안 매초마다 시간을 감소시키는 useEffect
    useEffect(() => {
        if (isTimerRunning && timer > 0) {
            const interval = setInterval(() => {
                setTimer((prevTime) => prevTime - 1);
            }, 1000);

            return () => clearInterval(interval);
        } else if (timer === 0) {
            setIsTimerRunning(false);
            setIsEmailDisabled(false); // 타이머 종료 시 버튼 활성화
        }
    }, [timer, isTimerRunning]);

    useEffect(() => {
        // 이메일 변경될 때 타이머와 버튼 상태 초기화
        setTimer(180);
        setIsTimerRunning(false);
        setShowCertificationInput(false);
        setIsEmailDisabled(false);
    }, [watch('email')]);

    const handleCertificationCheck = async () => {
        const enteredCode = watch('certificationNum');
        const correctCode = '123456'; // 이곳에 실제 인증번호 로직 적용

        if (enteredCode === correctCode) {
            setModalMessage('인증이 성공했습니다.');
            setIsCertified(true);
            setShowCertificationInput(false); // 인증번호 필드 숨기기
            setIsTimerRunning(false); // 타이머 정지
        } else {
            setModalMessage('인증에 실패했습니다. 다시 시도해주세요.');
            setIsCertified(false);
            setShowCertificationInput(false);
            setIsTimerRunning(false);
        }

        setIsModalOpen(true);
    };

    // 가정된 API 호출 함수 (실제 API 로직으로 대체 필요)
    const checkEmailDuplicate = async (email) => {
        const dummyExistingEmails = [
            'existingemail@domain.com',
            'test3@example.com',
        ];
        return dummyExistingEmails.includes(email);
    };

    // 입력값 변경 핸들러
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserInfo((prev) => ({
            ...prev,
            [name]: value,  // 해당 필드만 업데이트
        }));
    };

    // 모달 닫기 함수
    const closeModal = () => {
        setIsModalOpen(false);
        setModalMessage('');
    };

    return (
        <StyledContainer>
                <StyledTitle>개인정보 수정</StyledTitle>
                <StyledContent>
                    <form
                    noValidate
                    onSubmit={handleSubmit((data) => alert(JSON.stringify(data)))}
                    >
                        {/* 아이디 */}
                        <InputContainer style={{ marginBottom: '50px' }}>
                            <Label>아이디</Label>
                            <span>{userInfo?.id}</span>
                        </InputContainer>

                        {/* 비밀번호 */}
                        <InputContainer style={{ marginBottom: '35px' }}>
                            <Label>비밀번호</Label>
                            <InputField
                                id="password"
                                type="password"
                                placeholder="*********"
                                value={password}
                                {...register('password')}
                                onChange={handlePasswordChange}
                                aria-invalid={errors.password ? 'true' : 'false'}
                            />
                        </InputContainer>
                        <ErrorStyled>
                            {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}
                        </ErrorStyled>

                        {/* 비밀번호 확인 */}
                        <InputContainer style={{ marginBottom: '35px' }}>
                            <Label>비밀번호 확인</Label>
                            <InputField
                                id="passwordConfirm"
                                type="password"
                                placeholder="비밀번호 확인"
                                value={passwordConfirm}
                                {...register('passwordConfirm')}
                                onChange={handlePasswordConfirmChange}
                                aria-invalid={errors.passwordConfirm ? 'true' : 'false'}
                            />
                        </InputContainer>
                        <ErrorStyled>
                            {errors.passwordConfirm && <ErrorMessage>{errors.passwordConfirm.message}</ErrorMessage>}
                        </ErrorStyled>

                        {/* 이름 */}
                        <InputContainer style={{ marginTop: '50px', marginBottom: '70px' }}>
                            <Label>이름</Label>
                            <span>{userInfo?.name}</span>
                        </InputContainer>

                        {/* 전화번호 */}
                        <InputContainer style={{ marginBottom: '50px' }}>
                            <Label>전화번호</Label>
                            <span>{userInfo?.phonenumber}</span>
                        </InputContainer>

                        {/* 이메일 */}
                        <InputContainer style={{ marginBottom: '35px' }}>
                            <Label>
                                이메일
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
                            />
                            <BtnStyled>
                                <Btn
                                    width="170px"
                                    height="65px"
                                    borderRadius="10px"
                                    fontSize="20px"
                                    text="인증번호 받기"
                                    type="button" // 버튼 타입을 submit에서 button으로 변경
                                    onClick={handleEmailCheck}
                                    disabled={
                                        isEmailDisabled || !!errors.email || !watch('email')
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
                        {showCertificationInput && (
                            <InputContainer>
                                <Label></Label>

                                <InputField
                                    id="certificationNum"
                                    type="tel"
                                    placeholder="인증번호 6자리를 입력해주세요."
                                    {...register('certificationNum', {
                                        maxLength: { value: 6 },
                                    })}
                                    onChange={(e) => {
                                        register('certificationNum').onChange(e);
                                        trigger('certificationNum'); // 유효성 검사 트리거
                                    }}
                                    aria-invalid={
                                        errors.certificationNum ? 'true' : 'false'
                                    }
                                />
                                <BtnStyled>
                                    <Btn
                                        width="170px"
                                        height="65px"
                                        borderRadius="10px"
                                        fontSize="20px"
                                        text="인증번호 확인"
                                        type="button" // 버튼 타입을 submit에서 button으로 변경
                                        onClick={handleCertificationCheck}
                                        disabled={!watch('certificationNum')}
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
                        <InputContainer style={{ marginBottom: '50px' }}>
                            <Label>닉네임</Label>
                            <InputField 
                                id="nickname"
                                type="text"
                                placeholder="닉네임을 입력해주세요"
                                {...register('nickname')}
                            />
                        </InputContainer>

                        {/* 생년월일 */}
                        <InputContainer style={{ marginBottom: '85px' }}>
                            <Label>생년월일</Label>
                            <span>{userInfo?.birthdate}</span>
                        </InputContainer>
                    </form>
                </StyledContent>

                {/* Modal */}
                <Modal
                    isOpen={isModalOpen}
                    onRequestClose={closeModal}
                    title={modalMessage}
                />
            </StyledContainer>
    )
}

// ----------비밀번호 확인 후 Component----------
function AfterCheck({ userData }) {
    const navigate = useNavigate();

    const [userInfo, setUserInfo] = useState({
        id: '',
        name: '',
        phonenumber: '',
        birthdate: '',
        email: '',
        nickname: '',
        profilephoto: '',
    });

    const [editModal, setEditModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalChildren, setModalChildren] = useState('');
    const [modalType, setModalType] = useState(1);
    const [isFormValid, setIsFormValid] = useState(false); // EditInfo 컴포넌트의 유효성 검사 상태

    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');

    // userData가 변경될 때 userInfo 업데이트
    useEffect(() => {
        if (userData) {
            setUserInfo({
                id: userData.id,
                name: userData.name,
                phonenumber: userData.phonenumber,
                birthdate: userData.birthdate,
                email: userData.email,
                nickname: userData.nickname,
                profilephoto: userData.profilephoto,
            });
        }
    }, [userData]);

    // 비밀번호와 비밀번호 확인의 유효성 검사
    useEffect(() => {
        const isValidPassword =
            password.length >= 10 &&
            /(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>?~-])/.test(password) &&
            /(?=.*\d)/.test(password) &&
            /(?=.*[a-zA-Z])/.test(password);

        const formValid = isValidPassword && password === passwordConfirm;
        setIsFormValid(formValid);
    }, [password, passwordConfirm]);

    // 수정 완료 Modal
    const handleEditSubmit = () => {
        if (password === '' && passwordConfirm === '') {
            // 비밀번호와 비밀번호 확인이 비어있을 때는 유효성 검사를 통과한 것으로 간주
            setModalTitle('수정이 완료되었습니다.');
            setModalChildren(null);
            setModalType(1);
            setEditModal(true);
        } else if (isFormValid) {
            // 비밀번호와 비밀번호 확인이 유효할 때
            setModalTitle('수정이 완료되었습니다.');
            setModalChildren(null);
            setModalType(1);
            setEditModal(true);
        } else {
            // 비밀번호가 유효하지 않거나 일치하지 않을 때
            setModalTitle('비밀번호를 다시 한번 확인해주세요.');
            setModalChildren(null);
            setModalType(1);
            setEditModal(true);
        }
    };

    // 탈퇴 요청 Modal
    const handleDeleteId = () => {
        setModalTitle('정말 탈퇴하시겠습니까?');
        setModalType(2);
        setDeleteModal(true);
    };

    // 탈퇴 완료 Modal
    const completeDeleteId = () => {
        setModalTitle('회원 탈퇴가 완료되었습니다.');
        setModalChildren(
            <>
                지금까지 <b>여기다</b>를 이용해주셔서 감사합니다.
            </>
        );
        setModalType(1);
        setDeleteModal(false);
        setEditModal(true);
    };

    const handleCloseEditModal = () => {
        setEditModal(false);
    };

    const handleCloseAndNavigateHome = () => {
        setEditModal(false);
        navigate('/home');
    };

    return (
        <AfterCheckStyle>
            {!userData || Object.keys(userData).length === 0 || !userInfo ? (
                <p>Loading...</p>
            ) : (
                <>
                    <ProfileImage userInfo={userInfo} setUserInfo={setUserInfo} />

                    <EditInfo 
                        userInfo={userInfo} 
                        setUserInfo={setUserInfo} 
                        password={password}
                        setPassword={setPassword}
                        passwordConfirm={passwordConfirm}
                        setPasswordConfirm={setPasswordConfirm}
                    />

                    <Btn 
                        width='240px'
                        height='82px'
                        fontWeight='bold'
                        fontSize='26px'
                        borderRadius='15px'
                        text='수정하기'
                        onClick={handleEditSubmit}
                    />

                    <Line />

                    <StyledContainer>
                        <StyledTitle>문의하기</StyledTitle>
                        <StyledContent>
                            <span>여기다 웹사이트 관련 문의사항은 <b>swuweb0320@gmail.com</b>으로 보내주시면 감사하겠습니다.</span>
                        </StyledContent>
                    </StyledContainer>

                    <StyledContainer>
                        <StyledTitle>회원 탈퇴</StyledTitle>
                        <StyledContent>
                            <ul style={{ margin: 0 }}>
                                <li>원활한 회원 정보 관리를 위해 회원 탈퇴 후 30일 간 탈퇴한 회원의 개인정보와 여행 일정 정보가 보존됩니다.</li>
                                <li><p>한번 탈퇴를 신청하면 취소할 수 없습니다.</p></li>
                            </ul>
                            <Btn 
                                width='180px'
                                height='55px'
                                borderRadius='15px'
                                borderColor='#59abe6'
                                backgroundColor='#fff'
                                color='#59abe6'
                                fontSize='20px'
                                text='회원 탈퇴'
                                style={{ marginTop: '12px' }}
                                onClick={handleDeleteId}
                            />
                        </StyledContent>

                        {/* Modals */}
                        <Modal 
                            isOpen={editModal} 
                            onRequestClose={handleCloseEditModal}
                            title={modalTitle}
                            children={modalChildren}
                            type={modalType}
                            onConfirm={handleCloseEditModal}
                        />
                        <Modal 
                            isOpen={deleteModal} 
                            onRequestClose={() => setDeleteModal(false)}
                            title={modalTitle}
                            children={modalChildren}
                            type={modalType}
                            onConfirm={completeDeleteId}
                        />
                    </StyledContainer>
                </>
            )}
        </AfterCheckStyle>
    );
}

// ----------메인 Component----------
export default function UserInfo() {
    const [isBtnClicked, setIsBtnClicked] = useState(false);
    const [userData, setUserData] = useState(null);

    // mockData 생성
    const mockData = {
        id: "baeksy1234",
        password: "1111",
        name: "백서영",
        birthdate: "2000-01-01",
        phonenumber: "010-1234-5678",
        email: "baeksy1234@gmail.com",
        nickname: "sy",
        profilephoto: defaultProfileImg
    };

    useEffect(() => {
        // 컴포넌트 마운트 시 mockData를 userData에 설정
        setUserData(mockData);
    }, []);

    return (
        <section>
            {/* 헤더 */}
            <header>
                <HeaderStyle>회원정보 관리</HeaderStyle>
            </header>

            {/* 비밀번호 확인 */}
            <article>
                <ArticleStyle>
                    
                    {isBtnClicked ? (
                        // 비밀번호 확인 성공하면 개인정보 수정 페이지 렌더링
                        <AfterCheck userData={userData} />
                    ) : (
                        // 처음에는 비밀번호 확인 페이지 렌더링
                        <BeforeCheck btnClick={setIsBtnClicked} userData={userData} />
                    )}

                </ArticleStyle>
            </article>
        </section>
    );
}
