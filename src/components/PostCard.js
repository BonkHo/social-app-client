import React, { useContext } from "react";
import { Link } from "react-router-dom";
// The createdAt property is a ISOstring and the moment function .fromNow() will display how long ago the post was created
import moment from "moment";
// SUI components
import { Card, Icon, Label, Image, Button, Popup } from "semantic-ui-react";
// Import context for user
import { AuthContext } from "../context/auth";
// Import components
import LikeButton from "./LikeButton.js";
import DeleteButton from "./DeleteButton.js";

const PostCard = ({
	post: { body, createdAt, id, username, likeCount, commentCount, likes },
}) => {
	const { user } = useContext(AuthContext);

	return (
		<Card fluid>
			<Card.Content>
				<Image
					floated="right"
					size="mini"
					src="https://react.semantic-ui.com/images/avatar/large/steve.jpg"
				/>
				<Card.Header>{username}</Card.Header>
				<Card.Meta as={Link} to={`/posts/${id}`}>
					{moment(createdAt).fromNow()}
				</Card.Meta>
				<Card.Description>{body}</Card.Description>
			</Card.Content>
			<Card.Content extra>
				<LikeButton user={user} post={{ id, likes, likeCount }} />
				<Popup
					inverted
					content="Comment"
					trigger={
						<Button labelPosition="right" as={Link} to={`/posts/${id}`}>
							<Button color="blue" basic>
								<Icon name="comments" />
							</Button>
							<Label basic color="blue" pointing="left">
								{commentCount}
							</Label>
						</Button>
					}
				/>

				{user && user.username === username && <DeleteButton postId={id} />}
			</Card.Content>
		</Card>
	);
};

export default PostCard;
