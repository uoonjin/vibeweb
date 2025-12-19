// 게시글 작성 기능
document.addEventListener('DOMContentLoaded', async function() {
    console.log('게시글 작성 페이지 로드됨');

    // 로그인 체크
    const { data: { session } } = await window.supabaseClient.auth.getSession();

    if (!session) {
        alert('로그인이 필요합니다.');
        window.location.href = 'login.html';
        return;
    }

    console.log('로그인 사용자:', session.user.email);

    const writeForm = document.getElementById('write-form');

    if (!writeForm) {
        console.error('작성 폼을 찾을 수 없습니다');
        return;
    }

    writeForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        console.log('게시글 작성 폼 제출됨');

        // 입력값 가져오기
        const title = document.getElementById('post-title').value.trim();
        const author = document.getElementById('post-author').value.trim();
        const content = document.getElementById('post-content').value.trim();

        console.log('제목:', title);
        console.log('작성자:', author);
        console.log('내용 길이:', content.length);

        // 유효성 검사
        if (!title || !author || !content) {
            alert('모든 필드를 입력해주세요.');
            return;
        }

        try {
            console.log('Supabase에 게시글 저장 시도...');

            // Supabase에 게시글 저장
            const { data, error } = await window.supabaseClient
                .from('posts')
                .insert([
                    {
                        title: title,
                        content: content,
                        author_id: session.user.id,
                        author_email: session.user.email,
                        author_name: author
                    }
                ])
                .select();

            console.log('저장 결과:', data);
            console.log('저장 에러:', error);

            if (error) {
                throw error;
            }

            console.log('게시글 저장 성공!');
            alert('게시글이 등록되었습니다.');

            // 게시판 목록으로 이동
            window.location.href = 'board.html';

        } catch (error) {
            console.error('게시글 저장 오류:', error);

            let errorMsg = '게시글 등록 중 오류가 발생했습니다.';

            if (error.message.includes('permission')) {
                errorMsg = '게시글 작성 권한이 없습니다. RLS 정책을 확인해주세요.';
            } else if (error.message.includes('violates')) {
                errorMsg = '필수 항목이 누락되었습니다.';
            }

            alert(errorMsg + '\n\n상세 오류: ' + error.message);
        }
    });
});
