// 회원가입 폼 처리
document.addEventListener('DOMContentLoaded', function() {
    console.log('회원가입 페이지 로드됨');

    const signupForm = document.getElementById('signup-form');
    const errorMessage = document.getElementById('error-message');
    const successMessage = document.getElementById('success-message');

    if (!signupForm) {
        console.error('회원가입 폼을 찾을 수 없습니다');
        return;
    }

    signupForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        console.log('회원가입 폼 제출됨');

        // 입력값 가져오기
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('password-confirm').value;

        console.log('입력된 이메일:', email);
        console.log('비밀번호 길이:', password.length);

        // 에러/성공 메시지 초기화
        errorMessage.classList.remove('show');
        successMessage.classList.remove('show');
        errorMessage.textContent = '';
        successMessage.textContent = '';

        // 유효성 검사
        if (!email || !password || !passwordConfirm) {
            showError('모든 필드를 입력해주세요.');
            return;
        }

        if (password !== passwordConfirm) {
            showError('비밀번호가 일치하지 않습니다.');
            return;
        }

        if (password.length < 6) {
            showError('비밀번호는 최소 6자 이상이어야 합니다.');
            return;
        }

        // 이메일 형식 검사
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showError('올바른 이메일 형식을 입력해주세요.');
            return;
        }

        try {
            console.log('Supabase 회원가입 시도 중...');
            console.log('supabaseClient 확인:', window.supabaseClient);

            // Supabase 회원가입
            const { data, error } = await window.supabaseClient.auth.signUp({
                email: email,
                password: password,
                options: {
                    emailRedirectTo: window.location.origin + '/login.html'
                }
            });

            console.log('Supabase 응답 데이터:', data);
            console.log('Supabase 에러:', error);

            if (error) {
                throw error;
            }

            // 회원가입 성공
            console.log('회원가입 성공!');
            showSuccess('회원가입이 완료되었습니다! 로그인 페이지로 이동합니다...');

            // 2초 후 로그인 페이지로 이동
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);

        } catch (error) {
            console.error('회원가입 오류:', error);
            console.error('에러 메시지:', error.message);

            // 에러 메시지 한글화
            let errorMsg = '회원가입 중 오류가 발생했습니다: ' + error.message;

            if (error.message.includes('already registered') || error.message.includes('User already registered')) {
                errorMsg = '이미 가입된 이메일입니다.';
            } else if (error.message.includes('Invalid email')) {
                errorMsg = '유효하지 않은 이메일 형식입니다.';
            } else if (error.message.includes('Password')) {
                errorMsg = '비밀번호 요구사항을 확인해주세요.';
            } else if (error.message.includes('Unable to validate email address')) {
                errorMsg = '이메일 주소를 검증할 수 없습니다. 올바른 이메일을 입력해주세요.';
            }

            showError(errorMsg);
        }
    });

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
