// JSX, Routes, and Hooks
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, gql } from "@apollo/client";
// SUI Imports
import { Button, Icon, Label, Popup } from "semantic-ui-react";

const LikeButton = ({ user, post: { id, likes, likeCount } }) => {
	const [liked, setLiked] = useState(false);
	const [likePost] = useMutation(LIKE_POST_MUTATION, {
		variables: { postId: id },
	});

	useEffect(() => {
		if (user && likes.find((like) => like.username === user.username)) {
			setLiked(true);
		} else setLiked(false);
	}, [user, likes]);

	const likeButton = user ? (
		liked ? (
			<Button color="red">
				<Icon name="heart" />
			</Button>
		) : (
			<Button color="red" basic>
				<Icon name="heart" />
			</Button>
		)
	) : (
		<Button as={Link} to="/login" color="red" basic>
			<Icon name="heart" />
		</Button>
	);

	return (
		<Popup
			inverted
			content={liked ? "Unlike" : "Like"}
			trigger={
				<Button as="div" labelPosition="right" onClick={likePost}>
					{likeButton}
					<Label basic color="red" pointing="left">
						{likeCount}
					</Label>
				</Button>
			}
		/>
	);
};

const LIKE_POST_MUTATION = gql`
	mutation likePost($postId: ID!) {
		likePost(postId: $postId) {
			id
			likes {
				id
				username
			}
			likeCount
		}
	}
`;

export default LikeButton;
