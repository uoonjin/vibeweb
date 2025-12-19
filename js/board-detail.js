// 게시글 상세보기 기능
document.addEventListener('DOMContentLoaded', async function() {
    console.log('게시글 상세 페이지 로드됨');

    // URL에서 게시글 ID 가져오기
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');

    console.log('게시글 ID:', postId);

    if (!postId) {
        alert('게시글 ID가 없습니다.');
        window.location.href = 'board.html';
        return;
    }

    // 게시글 불러오기
    await loadPost(postId);

    // 삭제 버튼 이벤트
    setupDeleteButton(postId);
});

// 게시글 상세 정보 불러오기
async function loadPost(postId) {
    try {
        console.log('게시글 불러오기 시작...');

        // Supabase에서 게시글 가져오기
        const { data: post, error } = await window.supabaseClient
            .from('posts')
            .select('*')
            .eq('id', postId)
            .single();

        console.log('불러온 게시글:', post);
        console.log('에러:', error);

        if (error) {
            throw error;
        }

        if (!post) {
            alert('게시글을 찾을 수 없습니다.');
            window.location.href = 'board.html';
            return;
        }

        // 조회수 증가
        await incrementViews(postId);

        // 게시글 렌더링
        renderPost(post);

        // 수정/삭제 버튼 권한 체크
        await checkPermissions(post);

    } catch (error) {
        console.error('게시글 불러오기 오류:', error);
        alert('게시글을 불러오는 중 오류가 발생했습니다: ' + error.message);
        window.location.href = 'board.html';
    }
}

// 조회수 증가
async function incrementViews(postId) {
    try {
        const { error } = await window.supabaseClient.rpc('increment_views', {
            post_id: postId
        });

        if (error) {
            // RPC 함수가 없으면 직접 업데이트
            console.log('RPC 함수 없음, 직접 업데이트 시도');

            const { data: post } = await window.supabaseClient
                .from('posts')
                .select('views')
                .eq('id', postId)
                .single();

            if (post) {
                await window.supabaseClient
                    .from('posts')
                    .update({ views: post.views + 1 })
                    .eq('id', postId);
            }
        }

        console.log('조회수 증가 완료');
    } catch (error) {
        console.error('조회수 증가 오류:', error);
    }
}

// 게시글 렌더링
function renderPost(post) {
    // 제목
    const titleElement = document.querySelector('.detail-title');
    if (titleElement) {
        titleElement.textContent = post.title;
    }

    // 작성자
    const authorElement = document.querySelector('.meta-author strong');
    if (authorElement) {
        authorElement.textContent = post.author_name || post.author_email;
    }

    // 작성일
    const dateElement = document.querySelector('.meta-date strong');
    if (dateElement) {
        const createdDate = new Date(post.created_at);
        dateElement.textContent = createdDate.toISOString().split('T')[0];
    }

    // 조회수
    const likesElement = document.querySelector('.meta-likes strong');
    if (likesElement) {
        likesElement.textContent = post.views + 1; // 현재 조회 포함
    }

    // 내용
    const contentElement = document.querySelector('.detail-content');
    if (contentElement) {
        // 줄바꿈 유지
        contentElement.innerHTML = `<p>${escapeHtml(post.content).replace(/\n/g, '<br>')}</p>`;
    }

    console.log('게시글 렌더링 완료');
}

// 권한 확인 및 버튼 표시/숨김
async function checkPermissions(post) {
    try {
        const { data: { session } } = await window.supabaseClient.auth.getSession();

        const editBtn = document.querySelector('.btn-edit');
        const deleteBtn = document.querySelector('.btn-delete');

        if (!session) {
            // 로그인하지 않은 경우 수정/삭제 버튼 숨김
            if (editBtn) editBtn.style.display = 'none';
            if (deleteBtn) deleteBtn.style.display = 'none';
            return;
        }

        // 자기 글인지 확인
        const isAuthor = session.user.id === post.author_id;

        if (!isAuthor) {
            // 자기 글이 아니면 수정/삭제 버튼 숨김
            if (editBtn) editBtn.style.display = 'none';
            if (deleteBtn) deleteBtn.style.display = 'none';
        }

    } catch (error) {
        console.error('권한 확인 오류:', error);
    }
}

// 삭제 버튼 설정
function setupDeleteButton(postId) {
    const deleteBtn = document.querySelector('.btn-delete');

    if (deleteBtn) {
        deleteBtn.addEventListener('click', async function() {
            if (!confirm('정말 삭제하시겠습니까?')) {
                return;
            }

            try {
                console.log('게시글 삭제 시도...');

                const { error } = await window.supabaseClient
                    .from('posts')
                    .delete()
                    .eq('id', postId);

                if (error) {
                    throw error;
                }

                console.log('게시글 삭제 완료');
                alert('게시글이 삭제되었습니다.');
                window.location.href = 'board.html';

            } catch (error) {
                console.error('게시글 삭제 오류:', error);
                alert('게시글 삭제 중 오류가 발생했습니다: ' + error.message);
            }
        });
    }
}

// HTML 이스케이프 (XSS 방지)
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
