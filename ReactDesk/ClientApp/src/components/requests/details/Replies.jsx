import React, { Component } from 'react'

export default class Replies extends Component {
    constructor(props) {
        super(props)

        this.state = {
            show: false
        }
    }

    showOrHideReplies = () => {
        let previous = this.state.show;
        if (this.state.show === false) {
            document.getElementById('replies').style.display = 'block'
        } else {
            document.getElementById('replies').style.display = 'none'
        }
        this.setState({
            show: !previous
        })       
    }

    render() {
        let showing = this.state.show;
        let buttonText = showing === false ? 'Show Replies' : 'Hide Replies';
        let buttonColor = showing === false ? 'btn btn-warning' : 'btn btn-danger';
        let replies = this.props.replies

        return (
            replies ? <div>
                <div className='text-center'>
                    <button type="button" className={buttonColor} data-toggle="collapse" onClick={this.showOrHideReplies}>{buttonText}</button>
                </div>
                <br/>
                <div id="replies" className="collapse">
                    <div className="panel">
                        <div className="panel-heading clearfix">
                            <div className="pull-left"><strong>Replies</strong></div>
                        </div>
                        {replies.map(reply =>
                            <div className="panel-body">
                                <div className="panel-heading clearfix">
                                    <div className="pull-left"><strong>Author:</strong> {reply.author}</div>
                                    <div className="pull-right"><strong>Created On:</strong> {reply.creationTime}</div>
                                </div>
                                <div className="panel-body">
                                    <p><strong>Subject:</strong> {reply.subject}</p>
                                    <strong>Description</strong>
                                    <p>{reply.description}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div > : null

        )
    }
}