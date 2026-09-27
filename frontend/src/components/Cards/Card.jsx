import React from "react";

const Card = ({ headerImg, header, body, buttonText }) => {
	return (
		<div className="cards-container__card">
			{headerImg ? (
				<img src={headerImg} alt="" />
			) : (
				<div className="cards-container__card__art" aria-hidden="true">
					<span>{header}</span>
				</div>
			)}
			<div className="cards-container__card__body_wrapper">
				<h1>{header}</h1>
				<p>{body}</p>
                <button>{buttonText}</button>
			</div>
		</div>
	);
};

export default Card;
