// 로그인 폼 처리
document.addEventListener('DOMContentLoaded', function() {
    console.log('로그인 페이지 로드됨');

    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');
    const successMessage = document.getElementById('success-message');

    if (!loginForm) {
        console.error('로그인 폼을 찾을 수 없습니다');
        return;
    }

    // 이미 로그인되어 있는지 확인
    checkExistingSession();

    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        console.log('로그인 폼 제출됨');

        // 입력값 가져오기
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('remember-me').checked;

        console.log('입력된 이메일:', email);
        console.log('자동 로그인:', rememberMe);

        // 에러/성공 메시지 초기화
        errorMessage.classList.remove('show');
        successMessage.classList.remove('show');
        errorMessage.textContent = '';
        successMessage.textContent = '';

        // 유효성 검사
        if (!email || !password) {
            showError('이메일과 비밀번호를 입력해주세요.');
            return;
        }

        try {
            console.log('Supabase 로그인 시도 중...');
            console.log('supabaseClient 확인:', window.supabaseClient);

            // Supabase 로그인 (자동 로그인 옵션 적용)
            const { data, error } = await window.supabaseClient.auth.signInWithPassword({
                email: email,
                password: password
            });

            console.log('로그인 응답 데이터:', data);
            console.log('로그인 응답 user:', data.user);
            console.log('로그인 응답 session:', data.session);
            console.log('로그인 에러:', error);

            if (error) {
                throw error;
            }

            // 세션이 없는 경우 체크
            if (!data.session) {
                throw new Error('세션 생성 실패. 이메일 인증을 확인해주세요.');
            }

            // 이메일 인증 여부 확인
            if (data.user && !data.user.email_confirmed_at) {
                console.warn('이메일 미인증 사용자');
                showError('이메일 인증이 필요합니다. 가입 시 받은 이메일에서 인증 링크를 클릭해주세요.');
                return;
            }

            // 자동 로그인 설정 저장
            if (rememberMe) {
                // 자동 로그인: localStorage 사용 (영구 저장)
                localStorage.setItem('rememberMe', 'true');
                console.log('자동 로그인 활성화 - localStorage 사용');
            } else {
                // 자동 로그인 안 함: sessionStorage만 사용 (브라우저 닫으면 로그아웃)
                localStorage.removeItem('rememberMe');
                console.log('자동 로그인 비활성화 - sessionStorage 사용');
            }

            // Supabase 세션 새로고침하여 스토리지 설정 적용
            await window.supabaseClient.auth.refreshSession();

            // 로그인 성공
            console.log('로그인 성공!');
            console.log('사용자 정보:', data.user);
            showSuccess('로그인 성공! 게시판으로 이동합니다...');

            // 1초 후 게시판 페이지로 이동
            setTimeout(() => {
                window.location.href = 'board.html';
            }, 1000);

        } catch (error) {
            console.error('로그인 오류:', error);
            console.error('에러 메시지:', error.message);

            // 에러 메시지 한글화
            let errorMsg = '로그인 중 오류가 발생했습니다: ' + error.message;

            if (error.message.includes('Invalid login credentials')) {
                errorMsg = '이메일 또는 비밀번호가 올바르지 않습니다.';
            } else if (error.message.includes('Email not confirmed')) {
                errorMsg = '이메일 인증이 필요합니다. 이메일을 확인해주세요.';
            } else if (error.message.includes('Invalid email')) {
                errorMsg = '유효하지 않은 이메일 형식입니다.';
            }

            showError(errorMsg);
        }
    });

    // 기존 세션 확인
    async function checkExistingSession() {
        try {
            const { data: { session } } = await window.supabaseClient.auth.getSession();

            if (session) {
                console.log('기존 세션 발견:', session);
                // 이미 로그인되어 있으면 게시판으로 이동
                window.location.href = 'board.html';
            }
        } catch (error) {
            console.error('세션 확인 오류:', error);
        }
    }

    function showError(message) {
        console.log('에러 표시:', message);
        errorMessage.textContent = message;
        errorMessage.classList.add('show');
    }

    function showSuccess(message) {
        console.log('성공 메시지 표시:', message);
        successMessage.textContent = message;
        successMessage.classList.add('show');
    }
});
