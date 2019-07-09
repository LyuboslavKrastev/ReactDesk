import React, { Component } from 'react'

export default class AttachmentsSection extends Component {
    render() {
        let attachments = this.props.attachments
        return (
            <div>
                {attachments !== undefined && attachments.length > 0 ?
                    <div className="text-center">
                        <br />
                        <label className="text-center">Attachments: </label>
                        <hr />
                        {attachments.map((a, index) =>
                            <div key={index}>
                                <a onClick={() => this.props.getFile(a.fileName, a.pathToFile, a.id)}>
                                    {a.fileName}
                                </a>
                                <br />
                            </div>
                        )}
                    </div>
                    : null}
            </div>
        )
    }
}

