import React from 'react';
import styled from 'styled-components';

const Nav = styled.nav`
    display: flex;
    justify-content: flex-end; /* 오른쪽 정렬 */
    align-items:center;
    gap: 4px;
    margin: 16px;
`;

const Button = styled.button`
    display: inline-flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 25px;
    height: 24px;
    gap: 10px;
    padding: 0;
    border: 1px solid #F6F6F6;
    border-radius: 4px;
    background-color: #F6F6F6;
    color: var(--gray-01, #424242);
    font-family: Poppins;
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
    line-height: 100%; /* 12px */
    letter-spacing: -0.12px;

    &:hover {
        color: #59ABE6;
        font-weight: bolder;
        cursor: pointer;
    }

    &[disabled] {
        cursor: revert;
        transform: revert;
    }

    &[aria-current='page'] {
        border: 1px solid #59ABE6;
        background-color: #59ABE6;
        color: white;
        font-weight: bold;
        cursor: revert;
        transform: revert;
    }
`;

const Pagination = ({ total, limit, page, setPage }) => {
    const numPages = Math.ceil(total / limit);
    console.log(numPages);

    return (
        <Nav>
            <Button onClick={() => setPage(page - 1)} disabled={page === 1}>
                &lt;
            </Button>
            {Array(numPages)
                .fill()
                .map((_, i) => (
                    <Button
                        key={i + 1}
                        onClick={() => setPage(i + 1)}
                        aria-current={page === i + 1 ? "page" : null}
                    >
                        {i + 1}
                    </Button>
                ))}
            <Button
                onClick={() => setPage(page + 1)}
                disabled={page === numPages}
            >
                &gt;
            </Button>
        </Nav>
    );
}

export default Pagination;