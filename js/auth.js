// 인증 상태 관리 및 헤더 업데이트
document.addEventListener('DOMContentLoaded', async function() {
    console.log('auth.js 로드됨');

    // 로그인 상태 확인 및 헤더 업데이트
    await updateAuthUI();

    // 로그아웃 버튼 이벤트 리스너
    setupLogoutButton();
});

// 로그인 상태에 따라 UI 업데이트
async function updateAuthUI() {
    try {
        const { data: { session } } = await window.supabaseClient.auth.getSession();

        console.log('현재 세션:', session);

        const authButton = document.querySelector('.btn-login');

        if (session) {
            // 로그인 상태
            console.log('로그인 상태 - 사용자:', session.user.email);

            if (authButton) {
                authButton.textContent = '로그아웃';
                authButton.href = '#';
                authButton.classList.add('logout-btn');
            }
        } else {
            // 로그아웃 상태
            console.log('로그아웃 상태');

            if (authButton) {
                authButton.textContent = '로그인';
                authButton.href = 'login.html';
                authButton.classList.remove('logout-btn');
            }
        }
    } catch (error) {
        console.error('인증 상태 확인 오류:', error);
    }
}

// 로그아웃 버튼 설정
function setupLogoutButton() {
    document.addEventListener('click', async function(e) {
        if (e.target.classList.contains('logout-btn')) {
            e.preventDefault();
            console.log('로그아웃 버튼 클릭됨');

            if (confirm('로그아웃 하시겠습니까?')) {
                await logout();
            }
        }
    });
}

// 로그아웃 함수
async function logout() {
    try {
        console.log('로그아웃 시도 중...');

        const { error } = await window.supabaseClient.auth.signOut();

        if (error) {
            throw error;
        }

        console.log('로그아웃 성공');

        // rememberMe 정보 삭제
        localStorage.removeItem('rememberMe');

        // 로그인 페이지로 이동
        alert('로그아웃되었습니다.');
        window.location.href = 'index.html';

    } catch (error) {
        console.error('로그아웃 오류:', error);
        alert('로그아웃 중 오류가 발생했습니다: ' + error.message);
    }
}
