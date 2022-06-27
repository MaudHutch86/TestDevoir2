const Voting = artifacts.require("Voting");
const { BN, expectRevert, expectEvent } = require('@openzeppelin/test-helpers');

const { expect } = require('chai')

contract("Voting", ([owner, voter1, voter2, voter3])=> {
   
   let VotingInstance;
   describe ("TESTING MY 4 FUNCTIONS" , function () {
      before(async function () {
         VotingInstance = await Voting.new({ from: owner });
      });
      
      // TESTING VOTER FUNCTION

      it("should get registering voters status", async () => {
         const currentStatus = await VotingInstance.getCurrentStatus();
         const expected = Voting.WorkflowStatus.RegisteringVoters;
         expect(currentStatus).to.be.bignumber.equal(new BN(expected));
      });

      it("should add a voter", async () => {
         await VotingInstance.addVoter(voter1, {from : owner} );
         const result = await VotingInstance.getVoter(voter1, {from:voter1});
         expect(result.isRegistered === true);
         expect(result.hasVoted === false);
         expect(result.votedProposalId === 0); 
    
      });
        
      it("emits event VoterRegistered", async () => {
         expectEvent(await VotingInstance.addVoter(voter2, {from : owner} ), 'VoterRegistered', { voterAddress: voter2 });
      }); 

      it("should not add voter when is already register", async () => {
         await expectRevert(VotingInstance.addVoter(voter1, {from: owner}), "Already registered");
      });


      // TESTING PROPOSAL FUNCTION

      
      it("should not register a proposal when registration is not started", async () => {
         await expectRevert(VotingInstance.addProposal("_desc", {from:voter1}), 'Proposals are not allowed yet');
      });

      it("should change the status to startRegistrationProposal", async () => {
         await VotingInstance.startProposalsRegistering({from:owner});
         const currentStatus = await VotingInstance.getCurrentStatus();
         const expected = Voting.WorkflowStatus.ProposalsRegistrationStarted;
         expect(currentStatus).to.be.bignumber.equal(new BN(expected));
      });

      it("should not allow adding voters if registration completed", async () => {
         await expectRevert(VotingInstance.addVoter(voter3, {from : owner}), 'Voters registration is not open yet');
      
      });
      
      
      it("should add a proposal", async () => {
         let response = await VotingInstance.addProposal("_desc", {from:voter1});
         const proposalData = await VotingInstance.proposalsArray(0);
         expect(proposalData.description).to.equal('_desc');
         expectEvent(response, 'ProposalRegistered', { proposalId : new BN(0) });
      });
      
      // TESTING VOTING FUNCTION


      it('should start voting session', async () => {
         await VotingInstance.endProposalsRegistering({from:owner});
         await VotingInstance.startVotingSession({from:owner});
         const currentStatus = await VotingInstance.getCurrentStatus();
         const expected = Voting.WorkflowStatus.VotingSessionStarted;
         expect(currentStatus).to.be.bignumber.equal(new BN(expected));
      });

      it("emits event Voted", async () => {
         expectEvent(await VotingInstance.setVote(new BN(0), {from: voter1}), "Voted", {
            voter:voter1,
            proposalId: BN(0)
         });
      });
         
      it("should note allow to vote if already voted", async () => {
         await expectRevert(VotingInstance.setVote(new BN(0), {from : voter1} ), 'You have already voted');
      });

      // TESTING TALLY FUNCTION
      
      it("tally function test" , async () => {               
         await VotingInstance.endVotingSession({from:owner});
         await VotingInstance.tallyVotes({from:owner});
         expect(await VotingInstance.getWinningProposalID()).to.be.bignumber.equal(new BN(0));
      });

   });
});     

     





