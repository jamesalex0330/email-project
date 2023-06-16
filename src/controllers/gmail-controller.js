import repositories from "../repositories";
const { gmailRepository } = repositories;
export default {
  async messageList(req, res) {
    try {
      const result = await gmailRepository.getUnreadEmails();
      res.json(result);
    } catch (error) {
      res.send(error);
    }
  }
}