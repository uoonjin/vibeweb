// Supabase 설정 예제 파일
// 이 파일을 복사하여 'supabase-config.js'로 이름을 변경하고
// 아래 값들을 본인의 Supabase 프로젝트 정보로 변경하세요

const SUPABASE_URL = 'https://your-project-id.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key-here';

// Supabase CDN이 로드될 때까지 대기
console.log('window.supabase 확인:', typeof window.supabase);

// 사용자 정의 스토리지 (rememberMe에 따라 localStorage 또는 sessionStorage 사용)
const customStorage = {
    getItem: (key) => {
        try {
            const rememberMe = localStorage.getItem('rememberMe') === 'true';
            const value = rememberMe ? localStorage.getItem(key) : sessionStorage.getItem(key);
            console.log(`customStorage.getItem(${key}):`, value ? 'found' : 'null', 'rememberMe:', rememberMe);
            return value;
        } catch (error) {
            console.error('customStorage.getItem 오류:', error);
            return null;
        }
    },
    setItem: (key, value) => {
        try {
            const rememberMe = localStorage.getItem('rememberMe') === 'true';
            console.log(`customStorage.setItem(${key}):`, 'rememberMe:', rememberMe);
            if (rememberMe) {
                localStorage.setItem(key, value);
            } else {
                sessionStorage.setItem(key, value);
            }
        } catch (error) {
            console.error('customStorage.setItem 오류:', error);
        }
    },
    removeItem: (key) => {
        try {
            console.log(`customStorage.removeItem(${key})`);
            localStorage.removeItem(key);
            sessionStorage.removeItem(key);
        } catch (error) {
            console.error('customStorage.removeItem 오류:', error);
        }
    }
};

// Supabase 클라이언트 생성
window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        storage: customStorage
    }
});

console.log('Supabase 클라이언트 초기화 완료:', window.supabaseClient);
