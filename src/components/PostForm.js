// JSX & Hooks
import React from "react";
import { useForm } from "../util/hooks";
// GQL
import { gql, useMutation } from "@apollo/client";
import { FETCH_POSTS_QUERY } from "../util/graphql";
// SUI Components
import { Form, Button } from "semantic-ui-react";

const PostForm = () => {
	const { values, onChange, onSubmit } = useForm(createPostCallback, {
		body: "",
	});

	const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
		variables: values,
		update(proxy, result) {
			const data = proxy.readQuery({
				query: FETCH_POSTS_QUERY,
			});
			let newData = [...data.getPosts];
			newData = [result.data.createPost, ...newData];
			proxy.writeQuery({
				query: FETCH_POSTS_QUERY,
				data: { ...data, getPosts: { newData } },
			});
			values.body = "";
		},
	});

	function createPostCallback() {
		createPost();
	}

	return (
		<>
			<Form onSubmit={onSubmit}>
				<h2>Create a Post: </h2>
				<Form.Field>
					<Form.Input
						placeholder="What's on your mind?"
						name="body"
						onChange={onChange}
						value={values.body}
						error={error ? true : false}
					/>
					<Button disabled={!values.body.trim()} type="submit" color="teal">
						Submit
					</Button>
				</Form.Field>
			</Form>
			{error && (
				<div className="ui error message" style={{ marginBottom: 20 }}>
					<ul className="list">
						<li>{error.graphQLErrors[0].message}</li>
					</ul>
				</div>
			)}
		</>
	);
};

const CREATE_POST_MUTATION = gql`
	mutation createPost($body: String!) {
		createPost(body: $body) {
			id
			body
			createdAt
			username
			likes {
				id
				username
				createdAt
			}
			likeCount
			comments {
				id
				body
				username
				createdAt
			}
			commentCount
		}
	}
`;

export default PostForm;
