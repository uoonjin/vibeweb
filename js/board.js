// 게시판 목록 기능
document.addEventListener('DOMContentLoaded', async function() {
    console.log('게시판 목록 페이지 로드됨');

    await loadPosts();
});

// 게시글 목록 불러오기
async function loadPosts() {
    try {
        console.log('게시글 목록 불러오기 시작...');

        // Supabase에서 게시글 가져오기 (최신순)
        const { data: posts, error } = await window.supabaseClient
            .from('posts')
            .select('*')
            .order('created_at', { ascending: false });

        console.log('불러온 게시글:', posts);
        console.log('에러:', error);

        if (error) {
            throw error;
        }

        // 게시글 개수 업데이트
        const boardInfo = document.querySelector('.board-info strong');
        if (boardInfo) {
            boardInfo.textContent = posts.length;
        }

        // 게시글 목록 렌더링
        renderPosts(posts);

    } catch (error) {
        console.error('게시글 불러오기 오류:', error);
        alert('게시글을 불러오는 중 오류가 발생했습니다: ' + error.message);
    }
}

// 게시글 목록 렌더링
function renderPosts(posts) {
    const tbody = document.querySelector('.board-table tbody');

    if (!tbody) {
        console.error('테이블 tbody를 찾을 수 없습니다');
        return;
    }

    // 기존 내용 삭제
    tbody.innerHTML = '';

    if (posts.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: 40px;">
                    등록된 게시글이 없습니다.
                </td>
            </tr>
        `;
        return;
    }

    // 게시글 렌더링
    posts.forEach((post, index) => {
        const row = document.createElement('tr');

        // 날짜 포맷팅
        const createdDate = new Date(post.created_at);
        const formattedDate = createdDate.toISOString().split('T')[0]; // YYYY-MM-DD

        row.innerHTML = `
            <td>${posts.length - index}</td>
            <td class="title-cell">
                <a href="board-detail.html?id=${post.id}">${escapeHtml(post.title)}</a>
            </td>
            <td>${escapeHtml(post.author_name || post.author_email)}</td>
            <td>${formattedDate}</td>
            <td>${post.views}</td>
        `;

        tbody.appendChild(row);
    });

    console.log(`${posts.length}개의 게시글 렌더링 완료`);
}

// HTML 이스케이프 (XSS 방지)
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
