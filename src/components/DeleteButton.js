import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { FETCH_POSTS_QUERY } from "../util/graphql";
// SUI Components
import { Button, Icon, Confirm, Popup } from "semantic-ui-react";

const DeleteButton = ({ postId, commentId, callback }) => {
	const [confirmOpen, setConfirmOpen] = useState(false);

	const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;

	const [deletePostOrMutation] = useMutation(mutation, {
		update(proxy, result) {
			setConfirmOpen(false);

			if (!commentId) {
				let data = proxy.readQuery({ query: FETCH_POSTS_QUERY });
				let newData = data.getPosts.filter((post) => post.id !== postId);
				proxy.writeQuery({
					query: FETCH_POSTS_QUERY,
					data: { ...data, getPosts: { newData } },
				});
			}

			if (callback) callback();
		},
		variables: { postId, commentId },
	});

	return (
		<>
			<Popup
				inverted
				content={commentId ? "Delete Comment" : "Delete Post"}
				trigger={
					<Button
						as="div"
						color="gray"
						floated="right"
						onClick={() => setConfirmOpen(true)}
					>
						<Icon name="trash" style={{ margin: 0 }} />
					</Button>
				}
			/>
			<Confirm
				open={confirmOpen}
				onCancel={() => setConfirmOpen(false)}
				onConfirm={deletePostOrMutation}
			/>
		</>
	);
};

const DELETE_POST_MUTATION = gql`
	mutation deletePost($postId: ID!) {
		deletePost(postId: $postId)
	}
`;

const DELETE_COMMENT_MUTATION = gql`
	mutation deleteComment($postId: ID!, $commentId: ID!) {
		deleteComment(postId: $postId, commentId: $commentId) {
			id
			comments {
				id
				username
				createdAt
				body
			}
			commentCount
		}
	}
`;

export default DeleteButton;
