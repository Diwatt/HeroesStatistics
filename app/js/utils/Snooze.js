const snooze = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}
export default snooze;
