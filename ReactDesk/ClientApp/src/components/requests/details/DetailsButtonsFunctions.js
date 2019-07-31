const showResolution = () => {
    document.getElementById('resolution').style.display = 'block'
    document.getElementById('history').style.display = 'none'
    document.getElementById('request').style.display = 'none'
    document.getElementById('approvals').style.display = 'none'

    document.getElementById('btn_desc').classList.remove('btn-danger')
    document.getElementById('btn_res').classList.add('btn-danger')
    document.getElementById('btn_hist').classList.remove('btn-danger')
    document.getElementById('btn_appr').classList.remove('btn-danger')

}
const showDetails = () => {
    document.getElementById('resolution').style.display = 'none'
    document.getElementById('history').style.display = 'none'
    document.getElementById('approvals').style.display = 'none'
    document.getElementById('request').style.display = 'block'
    document.getElementById('btn_desc').classList.add('btn-danger')
    document.getElementById('btn_res').classList.remove('btn-danger')
    document.getElementById('btn_hist').classList.remove('btn-danger')
    document.getElementById('btn_appr').classList.remove('btn-danger')

}

const showHistory = () => {
    document.getElementById('history').style.display = 'block'
    document.getElementById('btn_hist').classList.add('btn-danger')

    document.getElementById('resolution').style.display = 'none'
    document.getElementById('request').style.display = 'none'
    document.getElementById('approvals').style.display = 'none'

    document.getElementById('btn_desc').classList.remove('btn-danger')
    document.getElementById('btn_res').classList.remove('btn-danger')
    document.getElementById('btn_appr').classList.remove('btn-danger')

}

const showApprovals = () => {
    document.getElementById('approvals').style.display = 'block'
    document.getElementById('btn_appr').classList.add('btn-danger')  
    document.getElementById('resolution').style.display = 'none'
    document.getElementById('history').style.display = 'none'
    document.getElementById('request').style.display = 'none'
    document.getElementById('btn_desc').classList.remove('btn-danger')
    document.getElementById('btn_res').classList.remove('btn-danger')
    document.getElementById('btn_hist').classList.remove('btn-danger')
}

export { showDetails, showHistory, showResolution, showApprovals}