import React, { useContext } from "react";
import { useQuery } from "@apollo/client";
import { AuthContext } from "../context/auth";
import { FETCH_POSTS_QUERY } from "../util/graphql";
// SUI Components
import { Grid, Transition } from "semantic-ui-react";
// Components
import PostCard from "../components/PostCard";
import PostForm from "../components/PostForm";

const Home = () => {
	const { user } = useContext(AuthContext);

	// useQuery hook takes in query from FETCH_POSTS_QUERY
	// The data will be stored in a getPosts object and should be destructured
	const { loading, data: { getPosts: posts } = {} } =
		useQuery(FETCH_POSTS_QUERY);
	console.log(posts);

	return (
		<Grid columns={3}>
			<Grid.Row className="page-title">
				<h1>Recent Posts</h1>
			</Grid.Row>
			<Grid.Row>
				{user && (
					<Grid.Column>
						<PostForm />
					</Grid.Column>
				)}
				{loading ? (
					<h1>Loading Posts...</h1>
				) : (
					<Transition.Group>
						{posts &&
							posts.map((post) => (
								<Grid.Column key={post.id} style={{ marginBottom: 20 }}>
									<PostCard post={post}></PostCard>
								</Grid.Column>
							))}
					</Transition.Group>
				)}
			</Grid.Row>
			<Grid.Row></Grid.Row>
		</Grid>
	);
};

export default Home;
