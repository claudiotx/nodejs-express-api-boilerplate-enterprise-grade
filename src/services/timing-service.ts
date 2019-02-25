class TimingService {
  public start(): [number, number] {
    return process.hrtime();
  }

  public stop(start: [number, number]): any {
    const hrEnd = process.hrtime(start);
    const pretty = `Execution time (hr): ${hrEnd[0]} ${(hrEnd[1] / 1000000).toFixed(2)}`;
    return pretty;
  }
}
export default new TimingService();